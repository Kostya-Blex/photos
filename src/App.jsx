import { Collection } from "./Collection";
import React, { useState, useEffect } from "react";

import "./index.scss";

const cats = [{ name: "Все" }, { name: "Море" }, { name: "Горы" }, { name: "Архитектура" }, { name: "Города" }];

function App() {
  const [categoryId, setCategoryId] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    const category = categoryId ? `category=${categoryId}` : "";

    fetch(`https://63bec7ee585bedcb36b6ca3f.mockapi.io/photos?page=${page + 1}&limit=3&${category}`)
      .then((res) => res.json())
      .then((json) => {
        setCollections(json);
      })
      .catch((err) => {
        console.warn(err);
        alert("Ошибка при получении данных");
      })
      .finally(() => setIsLoading(false));
  }, [categoryId, page]);
  return (
    <div className="App">
      <h1>Моя коллекция фотографий</h1>
      <div className="top">
        <ul className="tags">
          {cats.map((obj, i) => (
            <li className={categoryId === i ? "active" : ""} key={obj.name} onClick={() => setCategoryId(i)}>
              {obj.name}
            </li>
          ))}
        </ul>
        <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="search-input" placeholder="Поиск по названию" />
      </div>
      <div className="content">
        {isLoading ? (
          <h2>Идет загрузка...</h2>
        ) : (
          collections
            .filter((obj) => obj.name.toLowerCase().includes(searchValue.toLowerCase()))
            // .filter((obj) => (obj.category === categoryId || categoryId === 0 ? obj : ""))
            .map((obj, index) => <Collection name={obj.name} images={obj.photos} key={index} />)
        )}
      </div>
      <ul className="pagination">
        {[...Array(3)].map((_, i) => (
          <li onClick={() => setPage(i)} className={page === i ? "active" : ""}>
            {i + 1}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
