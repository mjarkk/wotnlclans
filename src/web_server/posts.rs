use super::{ok_res, Res};
use crate::other;
use actix_web::web::{scope, Json, ServiceConfig};

pub fn routes(app: &mut ServiceConfig) {
	app.service(scope("/api").service(check_community_block));
}

#[derive(Serialize)]
struct CheckCommunityBlockRes {
	errors: Vec<String>,
}

#[post("/checkCommunityBlock")]
pub async fn check_community_block(body: Json<other::CommunityBlock>) -> Res {
	let errors = body.0.check();
	ok_res(CheckCommunityBlockRes { errors })
}
