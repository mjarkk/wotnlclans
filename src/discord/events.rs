use super::parser::parse;
use serenity::async_trait;
use serenity::client::{Context, EventHandler};
use serenity::model::{channel::Message, gateway::Ready};

pub struct Handler;

#[async_trait]
impl EventHandler for Handler {
  async fn message(&self, ctx: Context, msg: Message) {
    let mut parts: Vec<&str> = msg.content.split(' ').collect();
    parts.reverse();
    let prefix = match parts.pop() {
      Some(v) => v,
      None => return, // WUT?
    };
    match prefix {
      "w" | "!" => (),
      _ => return, // Not a message for this bot
    }

    let message = if parts.len() == 0 {
      format!("Did you mean `{} help`", prefix)
    } else {
      parts.reverse();
      parse(prefix, parts)
    };
    let _ = msg.channel_id.say(&ctx.http, message).await;
  }

  async fn ready(&self, _: Context, _: Ready) {
    println!("Discord bot ready");
  }
}
