import { useState } from "react";
import "./styles.css";

const buns = ["Бриошь", "Черный"];
const meats = ["Говядина", "Курица"];
const extras = ["Сыр", "Бекон", "Помидор", "Салат", "Лук"];

function App() {
  const [customer, setCustomer] = useState("");
  const [bun, setBun] = useState("Бриошь");
  const [meat, setMeat] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [lastOrder, setLastOrder] = useState<number | null>(null);

  const toggleIngredient = (ingredient: string) => {
    setIngredients((previous) =>
      previous.includes(ingredient)
        ? previous.filter((item) => item !== ingredient)
        : [...previous, ingredient]
    );
  };

  const submitOrder = async () => {
    if (!customer.trim()) {
      setError("Введите имя клиента.");
      return;
    }

    if (!meat) {
      setError("Сначала выберите мясо.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/orders/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer: customer.trim(),
            bun,
            meat,
            ingredients,
            quantity,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось создать заказ");
      }

      setMessage(data.message);
      setLastOrder(data.order.id);

      setCustomer("");
      setBun("Бриошь");
      setMeat("");
      setIngredients([]);
      setQuantity(1);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ошибка соединения с сервером Django"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="burger-card">
        <div className="hero">
          <span className="burger-emoji">🍔</span>
          <p className="eyebrow">YOUR BURGER LAB</p>
          <h1>Конструктор бургера</h1>
          <p>Создай свой идеальный бургер</p>
        </div>

        <div className="form-section">
          <label htmlFor="customer">Имя клиента</label>
          <input
            id="customer"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Например, Мага"
          />
        </div>

        <div className="form-section">
          <h2>1. Выбери булочку</h2>
          <div className="option-list">
            {buns.map((item) => (
              <button
                key={item}
                type="button"
                className={`option ${bun === item ? "selected" : ""}`}
                onClick={() => setBun(item)}
              >
                {item === "Бриошь" ? "🍞" : "⚫"} {item}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>2. Выбери мясо *</h2>
          <div className="option-list">
            {meats.map((item) => (
              <button
                key={item}
                type="button"
                className={`option ${meat === item ? "selected" : ""}`}
                onClick={() => setMeat(item)}
              >
                {item === "Говядина" ? "🥩" : "🍗"} {item}
              </button>
            ))}
          </div>
          <p className="hint">Без выбранного мяса заказ оформить нельзя.</p>
        </div>

        <div className="form-section">
          <h2>3. Дополнительные ингредиенты</h2>
          <div className="ingredients">
            {extras.map((item) => (
              <label className="ingredient" key={item}>
                <input
                  type="checkbox"
                  checked={ingredients.includes(item)}
                  onChange={() => toggleIngredient(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>4. Количество бургеров</h2>
          <div className="quantity">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(100, q + 1))}
              disabled={quantity >= 100}
            >
              +
            </button>
          </div>
        </div>

        <div className="order-summary">
          <h2>Твой заказ</h2>
          <p>Клиент: {customer.trim() || "Не указано"}</p>
          <p>Булочка: {bun}</p>
          <p>Мясо: {meat || "Не выбрано"}</p>
          <p>
            Добавки: {ingredients.length ? ingredients.join(", ") : "Нет"}
          </p>
          <p>Количество: {quantity}</p>
        </div>

        {error && <p className="error-message">{error}</p>}
        {message && (
          <div className="success-message">
            <strong>✅ {message}</strong>
            <p>Бургер: {lastOrder !== null ? `заказ №${lastOrder}` : ""}</p>
          </div>
        )}

        <button
          className="submit-button"
          onClick={submitOrder}
          disabled={loading}
        >
          {loading ? "Отправка заказа..." : "Заказать"}
        </button>
      </section>
    </main>
  );
}

export default App;