export default function CookieCard(cookie) {
  const backendUrl = "http://127.0.0.1:8000/media/";
  return (
    <article class="card">
      <img
        class="card__background"
        src={`${backendUrl}${cookie.image}`}
        alt={`Photo of ${cookie.name} Cookie`}
        width="500"
        height="500"
      />
      <div class="card__content | flow">
        <div class="card__content--container | flow">
          <h2 class="card__title">{cookie.name}</h2>
          <p class="card__description">{cookie.description}</p>
        </div>
        <button class="card__button">Read more</button>
      </div>
    </article>
  );
}
