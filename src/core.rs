use napi::{Error, Status};

#[napi(object)]
pub struct LinearRegressionResult {
  pub intercept: f64,
  pub slope: f64,
  pub std_err: f64,
}

#[napi(object)]
pub struct StdOptions {
  pub is_population: Option<bool>,
}

pub fn mean(arr: &[f64]) -> f64 {
  if arr.is_empty() {
    return f64::NAN;
  }
  arr.iter().sum::<f64>() / arr.len() as f64
}

pub fn std(arr: &[f64], options: &Option<StdOptions>) -> f64 {
  if arr.len() < 2 {
    return f64::NAN;
  }
  let is_population: bool = match options {
    Some(options) => options.is_population.unwrap_or(false),
    None => false,
  };
  let m = mean(arr);
  let ss: f64 = arr.iter().map(|&k| (k - m).powi(2)).sum();
  let variance = ss / (arr.len() as f64 - if is_population { 0.0 } else { 1.0 });
  variance.sqrt()
}

pub fn linear_regression(x: &[f64], y: &[f64]) -> Result<LinearRegressionResult, Error> {
  if x.len() != y.len() {
    return Err(Error::new(
      Status::InvalidArg,
      format!("Expected length of 'x' and 'y' to be equal: {} != {}", x.len(), y.len()),
    ));
  }

  let n = x.len();
  if n < 3 {
    return Err(Error::new(
      Status::InvalidArg,
      format!("Regression model must include at least 3 points, found {}", n),
    ));
  }

  let x_mean = x.iter().sum::<f64>() / n as f64;
  let y_mean = y.iter().sum::<f64>() / n as f64;

  let mut xy_sum = 0.0;
  let mut x_squared_sum = 0.0;

  for i in 0..n {
    xy_sum += x[i] * y[i];
    x_squared_sum += x[i] * x[i];
  }

  let slope = (xy_sum - n as f64 * x_mean * y_mean) / (x_squared_sum - n as f64 * x_mean * x_mean);
  let intercept = y_mean - slope * x_mean;

  let mut residuals_squared_sum = 0.0;

  for i in 0..n {
    let residual = y[i] - (slope * x[i] + intercept);
    residuals_squared_sum += residual * residual;
  }

  let std_err = (residuals_squared_sum / (n as f64 - 2.0)).sqrt() / (x_squared_sum - n as f64 * x_mean * x_mean).sqrt();

  Ok(LinearRegressionResult {
    intercept,
    slope,
    std_err,
  })
}
