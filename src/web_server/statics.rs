use actix_files::Files;
use actix_files::NamedFile;
use actix_web::{web::scope, web::ServiceConfig, Result};

pub fn routes(app: &mut ServiceConfig) {
	app.service(
		scope("")
			.service(Files::new("/icons", "./icons").use_etag(true))
			.service(Files::new("/js", "./web_static/build/js").use_etag(true))
			.service(index)
			.service(manifest),
	);
}

#[get("/")]
async fn index() -> Result<NamedFile> {
	Ok(NamedFile::open("./web_static/build/index.html")?.use_last_modified(false))
}

#[get("/manifest.json")]
async fn manifest() -> Result<NamedFile> {
	Ok(NamedFile::open("./web_static/manifest.json")?.use_etag(true))
}
