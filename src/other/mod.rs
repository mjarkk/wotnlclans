use crypto::digest::Digest;
use crypto::sha1::Sha1;
use serde::{Deserialize, Serialize};
use serde_json;
use std::fs::read_to_string;
use structopt::StructOpt;

#[derive(Clone)]
pub struct ConfAndFlags(Conf, Flags);

impl ConfAndFlags {
  pub fn setup() -> Self {
    let flags = Flags::from_args();

    let config_string = read_to_string("./config.json").expect("Unable to open config.json");
    let config: Conf = serde_json::from_str(&config_string).expect("Invalid config.json");

    Self(config, flags)
  }
  pub fn conf(&self) -> &Conf {
    &self.0
  }
  pub fn flags(&self) -> &Flags {
    &self.1
  }
  pub fn get_wg_key(&self) -> &str {
    &self.conf().wargaming_key
  }
  pub fn is_dev(&self) -> bool {
    self.flags().dev
  }
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Conf {
  pub allowed_words: Vec<String>,
  pub disallowed_words: Vec<String>,
  pub blocked_clans: Vec<String>,
  pub extra_clans: Vec<String>,
  pub wargaming_key: String,
  pub discord_auth_token: String,
  pub webserver_location: String,
}

/// Program options
#[derive(Clone, Debug, StructOpt)]
pub struct Flags {
  /// Show debug messages
  #[structopt(long = "debug", short = "D")]
  pub debug: bool,

  /// Run the program in dev mode
  /// This sets the debug and maxIndexPages
  #[structopt(long = "dev", short = "d")]
  pub dev: bool,

  /// Set a maxium of pages to check for clans from the top clans list
  #[structopt(long = "maxIndexPages", short = "m")]
  max_index_pages: Option<usize>,

  /// Skip searching for clans at startup
  #[structopt(long = "skipStartupIndexing", short = "s")]
  pub skip_startup_indexing: bool,
}

impl Flags {
  pub fn get_max_index_pages(&self) -> usize {
    if let Some(pages) = self.max_index_pages {
      pages
    } else if self.dev {
      // In dev mode only index 30 pages so completing the statup progress is faster
      30
    } else {
      // In production index all pages, dunno why this is 4000 :)
      4000
    }
  }
}

/// returns the domain of a input string
/// ```
/// let domain = other::get_domain("https://test.somedomain.com/idk");
/// println!("{}", domain); // -> test.somedomain.com
/// ```
pub fn get_domain(input: &str) -> &str {
  let mut i = input.clone();
  if i.contains("http://") || i.contains("https://") {
    i = i.split("//").collect::<Vec<&str>>()[1];
  }

  i.split("/").collect::<Vec<&str>>()[0]
    .split("#")
    .collect::<Vec<&str>>()[0]
    .split("?")
    .collect::<Vec<&str>>()[0]
}

/// returns the sha1 hash of the input
pub fn get_hash(input: String) -> String {
  let mut hasher = Sha1::new();
  hasher.input_str(&input);
  hasher.result_str()
}

///removes quotes from the input
pub fn remove_quotes(input: &str) -> String {
  input.replace("\"", "")
}

/// removes quotes from the input strings
pub fn remove_all_quotes(input: Vec<String>) -> Vec<String> {
  input.iter().map(|val| remove_quotes(&val)).collect()
}

/// FormatSearch formats a string to make it better for comparing to other things
pub fn format_search(input: &str) -> String {
  input
    .replace("1", "i")
    .replace("3", "e")
    .replace("0", "o")
    .to_uppercase()
}

/// CommunityBlock contains the data for 1 block on the community tab
#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct CommunityBlock {
  /// The title shown
  text: String,

  /// Options for the background,
  /// There are 3 diffrent options here:
  /// 1. Link to the background image with no background text nor color
  /// 2. background text with background color
  /// 3. Only Color
  background: CommunityBlockBg,

  /// Data for the link at the right bottom
  /// if both of these are empty the link button won't be shown
  link: CommunityBlockLink,

  /// Can be set if you want to show the I button with
  /// The frontend will transform this to markdown
  /// If empty this will be hidden
  info: String,

  /// Requirements is a list of requirements/block tags
  /// these can be used for hiding a block if they are added
  requirements: Vec<CommunityBlockRequirements>,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
enum CommunityBlockRequirements {
  Discord,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct CommunityBlockBg {
  text: String,
  color: String,
  image: String,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
struct CommunityBlockLink {
  url: String,
  text: String,
}

impl CommunityBlock {
  /// check a communityblock and returns in a slice the errors if found
  pub fn check(&self) -> Vec<String> {
    let mut errs: Vec<String> = Vec::new();

    let bg_color = self.background.color.clone();
    let bg_image = self.background.image.clone();
    if bg_image.len() > 0 {
      if !bg_image.starts_with("https://") {
        errs
          .push("A background image must start with https:// not http:// nor some.url.com".into());
      }
      if bg_image.len() > 100 {
        errs.push("The background images url can't contain more than 100 characters".into());
      }
    } else if bg_color.len() > 0 {
      let check_color = |color: String| {
        if color.len() != 4 && color.len() != 7 {
          return false;
        }
        let mut c = color.trim_start_matches('#').to_string();
        if c.len() != 3 && c.len() != 6 {
          return false;
        }
        let to_replace = vec![
          '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'A', 'B',
          'C', 'D', 'E', 'F',
        ];
        for item in to_replace {
          c = c.replace(item, "")
        }
        return c.len() == 0;
      };
      if !check_color(bg_color) {
        errs.push("a background color must be a valid hex color like #000000 or #a1b2c3".into());
      }
    } else {
      errs.push("You must have a background color or image".into())
    }

    if self.background.text.len() > 16 {
      errs.push("The background text can't contain more than 16 characters".into());
    }

    if self.link.text.len() > 15 {
      errs.push("The link text can't contain more than 15 characters".into());
    }

    if self.link.url != "" {
      if !self.link.url.starts_with("https://") {
        errs
          .push("A background image MUST start with https:// not http:// nor some.url.com".into());
      }
      if self.link.url.len() > 100 {
        errs.push("The background images url can't contain more than 100 characters".into());
      }
    }

    if self.requirements.len() > 0 {
      errs.push("Invalid requirements".into())
    }

    if self.text.len() > 60 {
      errs.push("The title can't contain more than 60 characters".into())
    }

    if self.text.len() > 60 {
      errs.push("The title can't contain more than 60 characters".into())
    }

    if self.info.len() > 1700 {
      errs.push("The info can't contain more than 60 characters".into())
    }
    if self.info.contains("javascript:") || self.info.contains("data:") {
      errs.push("Invalid data".into())
    }

    errs
  }
}
