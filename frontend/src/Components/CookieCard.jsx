import ReactMarkdown from "react-markdown";

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
          <h1 class="card__title">{cookie.name}</h1>
          <ReactMarkdown>{cookie.description}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
