#![deny(clippy::all)]

mod core;
use core::{LinearRegressionResult, StdOptions};
use napi::{bindgen_prelude::Float64Array, Error};
use std::f64;

#[macro_use]
extern crate napi_derive;

#[napi]
pub fn sum(arr: Float64Array) -> f64 {
  if arr.is_empty() {
    return f64::NAN;
  }
  arr.iter().sum()
}

#[napi]
pub fn mean(arr: Float64Array) -> f64 {
  if arr.is_empty() {
    return f64::NAN;
  }
  core::mean(&arr)
}

#[napi]
pub fn std(arr: Float64Array, options: Option<StdOptions>) -> f64 {
  core::std(&arr, &options)
}

#[napi]
pub fn linear_regression(x: Float64Array, y: Float64Array) -> Result<LinearRegressionResult, Error> {
  core::linear_regression(&x, &y)
}
