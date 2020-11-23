use actix_files::Files;
use actix_web::{web::scope, web::ServiceConfig};

pub fn routes(app: &mut ServiceConfig) {
	app.service(
		scope("")
			.service(Files::new("/icons", "./icons").use_etag(true))
			.service(Files::new("/js", "./web_static/build/js").use_etag(true))
			.service(Files::new("/js", "./web_static/build/js").use_etag(true))
			.service(Files::new("", "./web_static/build/index.html").use_etag(true))
			.service(Files::new("/manifest.json", "./web_static/manifest.json").use_etag(true)),
	);
}
