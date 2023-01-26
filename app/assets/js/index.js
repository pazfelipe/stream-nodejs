const API_URL = "http://localhost:3000";

async function consume(signal) {
  const response = await fetch(API_URL, {
    signal
  });
  let counter = 0;
  const reader = response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(parseNdJSON());
  // .pipeTo(new WritableStream({
  //   write(chunk) {
  //     console.warn(counter++, chunk);
  //   }
  // }));

  return reader;
}

function appendToHtml(element) {
  return new WritableStream({
    write({ id, fullname, email, profession }) {
      const content = `
      <article>
        <div class="text">
          <h1>#${id} ${fullname}</h1>
          <p>E-mail: <a mailto="${email}">${email}</a></p>
          <p>Profession: ${profession}.</p>
        </div>
      </article>`;
      element.innerHTML += content;
    }
  });
}

function parseNdJSON() {
  let ndjsonBuffer = '';
  return new TransformStream({
    transform(chunk, controller) {
      ndjsonBuffer += chunk;
      const items = ndjsonBuffer.split('\n');
      items.slice(0, -1)
        .forEach(item => controller.enqueue(JSON.parse(item)));

      ndjsonBuffer = items[items.length - 1];
    },
    flush(controller) {
      if (ndjsonBuffer) return;
      controller.enqueue(JSON.parse(ndjsonBuffer));
    }
  });
}

const [
  start,
  stop,
  cards
] = [
  'start',
  'stop',
  'cards'
].map(el => document.getElementById(el));


let abortController = new AbortController();

start.addEventListener('click', async () => {
  start.setAttribute('disabled', true);
  const response = await consume(abortController.signal);
  response.pipeTo(appendToHtml(cards));

});

stop.addEventListener('click', () => {
  abortController.abort();
  abortController = new AbortController();
  start.removeAttribute('disabled');
});