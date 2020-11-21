use crate::db;
use futures::future;
use image;
use image::imageops::{overlay, resize, FilterType};
use image::{DynamicImage, GenericImage, ImageBuffer, ImageFormat, ImageOutputFormat, RgbaImage};
use serde_json;
use std::fs::OpenOptions;
use std::io::prelude::*;
use webp;

struct ImageAndIDType {
	id: String,
	image: DynamicImage,
}

async fn get_icon(clan: db::ClanStats, resize_to: u32) -> Result<ImageAndIDType, String> {
	let empty_string = String::new();
	let mut icon_to_get = clan.emblems.get("X195.Portal").unwrap_or(&empty_string);
	if icon_to_get.len() == 0 {
		icon_to_get = clan.emblems.get("X256.Wowp").unwrap_or(&empty_string);
		if icon_to_get.len() == 0 {
			return Err(format!("Clan {} has no usable icons to fetch", clan.tag));
		}
	}

	if !icon_to_get.contains("http://") && !icon_to_get.contains("https://") {
		return Err(format!(
			"Clan {} icon has an invalid url: {} , make sure the url starts with http(s)://",
			clan.tag, icon_to_get
		));
	}

	let body_bytes = reqwest::get(icon_to_get)
		.await
		.or_else(|e| {
			Err(format!(
				"Can't fetch image {}, error: {}, for clan: {}",
				icon_to_get, e, clan.tag
			))
		})?
		.bytes()
		.await
		.or_else(|e| {
			Err(format!(
				"Can't fetch image {}, error: {}, for clan: {}",
				icon_to_get, e, clan.tag
			))
		})?;

	let body = body_bytes.as_ref();

	// let icon_file_extension = icon_to_get.split(".").last().unwrap_or("png");
	let parsed_image = image::load_from_memory(body).or_else(|e| {
		Err(format!(
			"Unable to parse image {}, error: {}, for clan: {}",
			icon_to_get, e, clan.tag,
		))
	})?;

	Ok(ImageAndIDType {
		id: clan.id,
		image: parsed_image.resize(resize_to, resize_to, FilterType::CatmullRom),
	})
}

// GetIcons fetches all clan icons and creates a grid
pub async fn get() -> Result<(), String> {
	let img_size: u32 = 60;
	let imgs_in_a_row: usize = 30;

	println!("Getting clan icons...");

	let mut img_and_id: Vec<ImageAndIDType> = Vec::new();

	let current_stats = db::get_current_stats();

	let awaiting = current_stats.iter().map(|clan| get_icon(clan, img_size));
	let awaiting_res = join!(future::join_all(awaiting));

	for res in awaiting_res.0 {
		match res {
			Ok(v) => img_and_id.push(v),
			Err(e) => println!("{}", e),
		};
	}

	if img_and_id.len() == 0 {
		return Ok(());
	}

	let mut ids: Vec<Vec<String>> = vec![Vec::new()];
	let mut output_img: RgbaImage = ImageBuffer::new(img_size * imgs_in_a_row as u32, img_size);

	for img_obj in img_and_id {
		let id = img_obj.id;
		if ids[ids.len() - 1].len() == imgs_in_a_row {
			ids.push(Vec::new());

			// increase the size of the output_img
			let mut new_output_img: RgbaImage =
				ImageBuffer::new(img_size * imgs_in_a_row as u32, img_size * ids.len() as u32);
			overlay(&mut new_output_img, &output_img, 0, 0);
			output_img = new_output_img;
		}

		ids[ids.len() - 1].push(id);

		let from_top = (ids.len() - 1) as u32 * img_size;
		let from_left = (ids[ids.len() - 1].len() - 1) as u32 * img_size;

		overlay(&mut output_img, &img_obj.image, from_left, from_top);
	}

	output_img
		.save_with_format("./icons/allIcons.png", ImageFormat::Png)
		.or_else(|e| {
			Err(format!(
				"Unable to to save image in png format, error: {}",
				e,
			))
		});

	let output_img_dynamic = DynamicImage::ImageRgba8(output_img);
	let rgba_bytes = output_img_dynamic.to_rgba8();

	let encoded_webp = webp::Encoder::from_rgba(
		&rgba_bytes,
		img_size * imgs_in_a_row as u32, // Width
		img_size * ids.len() as u32,     // Height
	)
	.encode(50.0);

	let encoded_webp_bytes = encoded_webp.to_vec();

	let mut file = OpenOptions::new()
		.write(true)
		.create(true)
		.truncate(true)
		.open("./icons/allIcons.webp")
		.or_else(|e| {
			Err(format!(
				"Unable to to save image in webp format, error: {}",
				e,
			))
		})?;

	file.write(&encoded_webp_bytes).or_else(|e| {
		Err(format!(
			"Unable to to write webp data to image file, error: {}",
			e,
		))
	})?;

	let clan_location_in_icons = serde_json::to_vec(&ids).or_else(|e| {
		Err(format!(
			"Unable to to parse clan icons locations to file, error: {}",
			e,
		))
	})?;

	file = OpenOptions::new()
		.write(true)
		.create(true)
		.truncate(true)
		.open("./icons/allIcons.json")
		.or_else(|e| {
			Err(format!(
				"Unable to to create clan icons locations to file, error: {}",
				e,
			))
		})?;

	file.write_all(&clan_location_in_icons).or_else(|e| {
		Err(format!(
			"Unable to to write clan icons locations to file, error: {}",
			e,
		))
	})?;

	Ok(())
}
