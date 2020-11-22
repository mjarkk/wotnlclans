use super::commands::{get_help, get_options};
use std::collections::HashMap;

// parse parses a user command and returns a output text to return
pub fn parse(prefix: &str, input: Vec<&str>) -> String {
  let options = get_options();

  for option in options {
    let to_test: Vec<&str> = option.to_match.split(" ").collect();
    if input.len() == to_test.len() {
      let mut is_valid = true;
      let mut add_to_handler: HashMap<String, String> = HashMap::new();
      for (i, input_item) in input.iter().enumerate() {
        let match_item = to_test[i];
        if match_item.starts_with("{{") {
          let name = match_item.trim_matches(|c| c == '{' || c == '}');
          let input_item_string = input_item.to_string();
          add_to_handler.insert(String::from(name), input_item_string);
          continue;
        }
        if match_item.to_lowercase() == input_item.to_lowercase() {
          continue;
        }
        is_valid = false;
        break;
      }
      if is_valid {
        return (*option.handler)(add_to_handler);
      }
    }
  }

  get_help(prefix)
}
