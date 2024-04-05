import React, { useState, useEffect, useMemo } from "react";
import { useRef } from "react";

import { Block } from "./Block";
import "./index.scss";

function App() {
  const [fromCurrency, setFromCurrency] = useState("RUB");
  const [toCurrency, setToCurrency] = useState("USD");
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(1);

  // const [rates, setRates] = useState({});
  const ratesRef = useRef({});

  useEffect(() => {
    fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json")
      .then((res) => res.json())
      .then((json) => {
        ratesRef.current = json.map((jsonSingle) => {
          return { rate: jsonSingle.rate, currency: jsonSingle.cc };
        });

        onChangeToPrice(1);
      })
      .catch((err) => {
        console.warn(err);
        alert("Не удалось получить информацию");
      });
  }, []);

  const onChangeFromPrice = (value, to = true) => {
    let fromPrice = 0;
    let toPrice = 0;

    for (let i = 0; i < ratesRef.current.length; i++) {
      if (ratesRef.current[i].currency === fromCurrency) fromPrice = ratesRef.current[i].rate;

      if (ratesRef.current[i].currency === toCurrency) toPrice = ratesRef.current[i].rate;
    }

    if (to) {
      const result = (fromPrice / toPrice) * value;
      console.log(fromPrice);
      setToPrice(result.toFixed(3));
      setFromPrice(value);
    } else {
      const result = (toPrice / fromPrice) * value;

      setToPrice(value);
      setFromPrice(result.toFixed(3));
    }
  };

  const onChangeToPrice = (value) => {
    onChangeFromPrice(value, false);
  };

  useMemo(() => {
    onChangeFromPrice(fromPrice);
  }, [fromCurrency]);

  useMemo(() => {
    onChangeToPrice(toPrice);
  }, [toCurrency]);

  return (
    <div className="App">
      <Block value={fromPrice} currency={fromCurrency} onChangeCurrency={setFromCurrency} onChangeValue={onChangeFromPrice} />
      <Block value={toPrice} currency={toCurrency} onChangeCurrency={setToCurrency} onChangeValue={onChangeToPrice} />
    </div>
  );
}
export default Appx; //тут убрать x
