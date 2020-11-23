mod data;
mod posts;
mod statics;

use crate::other::ConfAndFlags;
use actix::System;
use actix_cors::Cors;
use actix_service::Service;
use actix_web::dev::{HttpResponseBuilder, ServiceRequest};
use actix_web::http::StatusCode;
use actix_web::web::{scope, JsonConfig};
use actix_web::{App, HttpResponse, HttpServer, ResponseError};
use futures::future::FutureExt;
use serde::Serialize;
use std::fmt;

pub async fn serve(config: ConfAndFlags) -> Result<(), String> {
	let _ = System::new("web_server");

	let webserver_location = config.webserver_location();

	let config_sync = config.clone();
	HttpServer::new(move || {
		let config_sync_cloned = config_sync.clone();
		let cors = Cors::default()
			.allow_any_origin()
			.allow_any_method()
			.allow_any_header()
			.max_age(3600);

		App::new()
			.wrap(cors)
			.data(JsonConfig::default().limit(4096))
			.configure(move |app| {
				app.service(
					scope("")
						.wrap_fn(move |mut req: ServiceRequest, srv| {
							let head = req.head_mut();
							head.extensions_mut().insert(config_sync_cloned.clone());
							srv.call(req).map(|res| res)
						})
						.configure(statics::routes)
						.configure(data::routes)
						.configure(posts::routes),
				);
			})
	})
	.bind(webserver_location)
	.or_else(|e| Err(format!("{}", e)))?
	.run()
	.await
	.or_else(|e| Err(format!("{}", e)))?;

	Ok(())
}

pub type Res = Result<HttpResponse, HTTPError>;

#[derive(Serialize)]
pub struct HTTPOk<T> {
	data: T,
	status: bool,
}

pub fn ok_res<T: Serialize>(value: T) -> Res {
	Ok(HttpResponse::Ok().json(HTTPOk {
		status: true,
		data: value,
	}))
}

#[derive(Debug, Serialize)]
pub struct HTTPError {
	error: String,
	status: bool,
}

impl HTTPError {
	pub fn new<T>(msg: impl Into<String>) -> Result<T, HTTPError> {
		Err(Self {
			error: msg.into(),
			status: false,
		})
	}
}

impl ResponseError for HTTPError {
	fn error_response(&self) -> HttpResponse {
		HttpResponseBuilder::new(self.status_code()).json(self)
	}
	fn status_code(&self) -> StatusCode {
		StatusCode::BAD_REQUEST
	}
}

impl fmt::Display for HTTPError {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "{}", self.error)
	}
}

impl From<String> for HTTPError {
	fn from(error: String) -> Self {
		Self {
			error,
			status: false,
		}
	}
}

impl From<&str> for HTTPError {
	fn from(error: &str) -> Self {
		Self {
			error: error.into(),
			status: false,
		}
	}
}
