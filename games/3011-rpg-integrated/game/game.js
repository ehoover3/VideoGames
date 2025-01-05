export function checkCollisionWithGameObject(player, gameObject) {
  return player.x < gameObject.x + gameObject.width && player.x + player.width > gameObject.x && player.y < gameObject.y + gameObject.height && player.y + player.height > gameObject.y;
}
