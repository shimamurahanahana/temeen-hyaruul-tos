// =====================================================
//  ХЭРЭГЛЭГЧИЙН СЭТГЭГДЭЛ — АДМИН ЭНД НЭМНЭ
//  Messenger-ээр ирсэн сэтгэгдлийг шалгаад доорх жагсаалтад нэмнэ.
//  Нэрээ нууцлах бол name-ийг хоосон ("") үлдээнэ → "Нэрээ нууцалсан хэрэглэгч" гэж гарна.
//  Жишээ (// -г арилгаад бөглөнө):
//  { name: "Б. Нэр", problem: "Өвдөгний өвдөлт", text: "Сэтгэгдэл...", stars: 5, image: "media/review-1.jpg" },
//  { name: "", problem: "Судасны бүдүүрэл", text: "Сэтгэгдэл...", stars: 5 },
// =====================================================
const reviews = [
];

const PHONE = "+976 8896 9631";
const MESSENGER = "https://m.me/ayur.ariunaa.2025";

// 1 ширхэг 40,000₮, 2 ба түүнээс дээш бол ширхэг бүр 35,000₮
function priceFor(qty) {
  return qty >= 2 ? qty * 35000 : qty * 40000;
}
const fmt = (n) => n.toLocaleString("en-US") + "₮";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// --- Сэтгэгдэл харуулах ---
const reviewsBox = document.getElementById("reviews");
if (reviews.length === 0) {
  reviewsBox.innerHTML = '<div class="empty">Хэрэглэгчдийн сэтгэгдэл удахгүй нэмэгдэнэ.</div>';
} else {
  reviews.forEach((r) => {
    const el = document.createElement("div");
    el.className = "review reveal";
    el.innerHTML = `
      <div class="stars">${"★".repeat(r.stars || 5)}</div>
      ${r.problem ? `<span class="problem">${esc(r.problem)}</span>` : ""}
      <p>${esc(r.text)}</p>
      ${r.image ? `<img src="${esc(r.image)}" alt="">` : ""}
      <div class="who">— ${r.name ? esc(r.name) : "Нэрээ нууцалсан хэрэглэгч"}</div>`;
    reviewsBox.appendChild(el);
  });
}

// --- Захиалгын тооцоолуур ---
const qtyInput = document.getElementById("o-qty");
const totalEl = document.getElementById("o-total");

function updateTotal() {
  let q = parseInt(qtyInput.value, 10);
  if (!q || q < 1) q = 1;
  qtyInput.value = q;
  totalEl.textContent = fmt(priceFor(q));
}
document.getElementById("q-minus").onclick = () => { qtyInput.value = Math.max(1, qtyInput.value - 1); updateTotal(); };
document.getElementById("q-plus").onclick = () => { qtyInput.value = +qtyInput.value + 1; updateTotal(); };
qtyInput.addEventListener("input", updateTotal);

document.getElementById("zahialga").addEventListener("submit", async (e) => {
  e.preventDefault();
  const q = parseInt(qtyInput.value, 10) || 1;
  const address = document.getElementById("o-address").value.trim();
  const msg =
    "Сайн байна уу, «Шидэт» тэмээн хяруулын тос " + q + " ширхэг захиалъя (" + fmt(priceFor(q)) + " + хүргэлт)." +
    (address ? "\nХаяг: " + address : "");
  try {
    await navigator.clipboard.writeText(msg);
    alert("Захиалгын текст хуулагдлаа ✔\nMessenger нээгдэхэд буулгаад (paste) илгээнэ үү.\n\nЭсвэл " + PHONE + " дугаарт залгана уу.");
  } catch {
    alert(msg + "\n\nДээрх текстийг Messenger-ээр илгээх эсвэл " + PHONE + " дугаарт залгана уу.");
  }
  window.open(MESSENGER, "_blank");
});

// --- Зураг томруулах ---
const lightbox = document.getElementById("lightbox");
document.querySelectorAll(".zoomable").forEach((img) => {
  img.addEventListener("click", () => {
    lightbox.querySelector("img").src = img.src;
    lightbox.classList.add("open");
  });
});
lightbox.addEventListener("click", () => lightbox.classList.remove("open"));

// --- Гүйлгэхэд гарч ирэх ---
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("show"); io.unobserve(en.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
