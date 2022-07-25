import connection from "../dbStrategy/postgres.js";

import dayjs from "dayjs";

export async function listarAlugueis(request, response) {
  try {
    // pegar a query string passada e tratar ela
    const { customerId } = request.query;
    const { gameId } = request.query;

    if (customerId) {
      // buscar todos os alugueis no BD e enviá-los para o front
      const { rows: alugueis } = await connection.query(
        `SELECT * FROM rentals WHERE "customerId"=${customerId}`
      );

      const alugueisMostrar = [];

      // para cada aluguel listado, buscar qual o cliente, o jogo e a categoria e inserir estes dados como parte do objeto
      for (let i = 0; i < alugueis.length; i++) {
        const { rows: buscarCliente } = await connection.query(
          `SELECT * FROM customers WHERE id='${alugueis[i].customerId}';`
        );

        const { rows: buscarJogo } = await connection.query(
          `SELECT * FROM games WHERE id='${alugueis[i].gameId}';`
        );

        const { rows: buscarCategoria } = await connection.query(
          `SELECT * FROM categories WHERE id='${buscarJogo[0].categoryId}';`
        );

        const aluguel = {
          ...alugueis[i],
          customer: {
            id: buscarCliente[0].id,
            name: buscarCliente[0].name,
          },
          game: {
            id: buscarJogo[0].id,
            name: buscarJogo[0].name,
            categoryId: buscarJogo[0].categoryId,
            categoryName: buscarCategoria[0].name,
          },
        };

        alugueisMostrar.push(aluguel);
      }

      response.send(alugueisMostrar);
    } else if (gameId) {
      // buscar todos os alugueis no BD e enviá-los para o front
      const { rows: alugueis } = await connection.query(
        `SELECT * FROM rentals WHERE "gameId"=${gameId}`
      );

      const alugueisMostrar = [];

      // para cada aluguel listado, buscar qual o cliente, o jogo e a categoria e inserir estes dados como parte do objeto
      for (let i = 0; i < alugueis.length; i++) {
        const { rows: buscarCliente } = await connection.query(
          `SELECT * FROM customers WHERE id='${alugueis[i].customerId}';`
        );

        const { rows: buscarJogo } = await connection.query(
          `SELECT * FROM games WHERE id='${alugueis[i].gameId}';`
        );

        const { rows: buscarCategoria } = await connection.query(
          `SELECT * FROM categories WHERE id='${buscarJogo[0].categoryId}';`
        );

        const aluguel = {
          ...alugueis[i],
          customer: {
            id: buscarCliente[0].id,
            name: buscarCliente[0].name,
          },
          game: {
            id: buscarJogo[0].id,
            name: buscarJogo[0].name,
            categoryId: buscarJogo[0].categoryId,
            categoryName: buscarCategoria[0].name,
          },
        };

        alugueisMostrar.push(aluguel);
      }

      response.send(alugueisMostrar);
    } else {
      // buscar todos os alugueis no BD e enviá-los para o front
      const { rows: alugueis } = await connection.query(
        "SELECT * FROM rentals"
      );

      const alugueisMostrar = [];

      // para cada aluguel listado, buscar qual o cliente, o jogo e a categoria e inserir estes dados como parte do objeto
      for (let i = 0; i < alugueis.length; i++) {
        const { rows: buscarCliente } = await connection.query(
          `SELECT * FROM customers WHERE id='${alugueis[i].customerId}';`
        );

        const { rows: buscarJogo } = await connection.query(
          `SELECT * FROM games WHERE id='${alugueis[i].gameId}';`
        );

        const { rows: buscarCategoria } = await connection.query(
          `SELECT * FROM categories WHERE id='${buscarJogo[0].categoryId}';`
        );

        const aluguel = {
          ...alugueis[i],
          customer: {
            id: buscarCliente[0].id,
            name: buscarCliente[0].name,
          },
          game: {
            id: buscarJogo[0].id,
            name: buscarJogo[0].name,
            categoryId: buscarJogo[0].categoryId,
            categoryName: buscarCategoria[0].name,
          },
        };

        alugueisMostrar.push(aluguel);
      }

      response.send(alugueisMostrar);
    }
  } catch (error) {
    response.status(500).send();
  }
}

export async function inserirAluguel(request, response) {
  try {
    const novoAluguel = request.body;

    // verificar se o customerId se refere a um cliente existente, se não, retornar erro
    const { rows: buscarCliente } = await connection.query(
      `SELECT * FROM customers WHERE id='${novoAluguel.customerId}';`
    );

    if (buscarCliente.length === 0) {
      response.status(400).send();
      return;
    }

    // verificar se o gameId se refere a um jogo existente, se não, retornar erro
    const { rows: buscarJogo } = await connection.query(
      `SELECT * FROM games WHERE id='${novoAluguel.gameId}';`
    );

    if (buscarJogo.length === 0) {
      response.status(400).send();
      return;
    }

    // verificar se a quantidade de dias alugado é maior que 0
    if (parseInt(novoAluguel.daysRented) <= 0) {
      response.status(400).send();
      return;
    }

    // validar se o jogo alugado esta em estoque (comparar o nome do jogo e quantas vezes ele aparece em alugado com a quantidade em estoque)
    const { rows: buscarQuantAlugado } = await connection.query(
      `SELECT * FROM rentals WHERE "gameId"='${novoAluguel.gameId}';`
    );

    if (buscarQuantAlugado.length >= buscarJogo[0].stockTotal) {
      response.status(400).send();
      return;
    }

    // calcular o preço total do aluguel
    const precoTotal =
      parseInt(novoAluguel.daysRented) * parseInt(buscarJogo[0].pricePerDay);

    // inserir o novo aluguel no BD
    await connection.query(
      `INSERT INTO rentals 
    (
        "customerId", 
        "gameId", 
        "rentDate", 
        "daysRented", 
        "returnDate", 
        "originalPrice", 
        "delayFee"
    ) 
    VALUES 
    (
        '${novoAluguel.customerId}', 
        '${novoAluguel.gameId}', 
        '${dayjs().format("YYYY-MM-DD")}', 
        '${novoAluguel.daysRented}', 
        ${null}, 
        '${precoTotal}', 
        ${null}
    )
    `
    );

    response.status(201).send();
  } catch (error) {
    response.status(500).send();
  }
}

export async function finalizarAluguel(request, response) {
  try {
    // pegar o id passado na rota
    const { id } = request.params;

    // selecionar o aluguel com o id
    const { rows: aluguelId } = await connection.query(
      "SELECT * FROM rentals WHERE id=$1",
      [id]
    );

    // se o id não for encontrado, enviar erro
    if (aluguelId.length === 0) {
      response.status(404).send();
      return;
    }

    // se o aluguel ja ter sido finalizado, enviar erro
    if (aluguelId[0].returnDate !== null) {
      response.status(400).send();
      return;
    }

    // atualizar a data de retorno do jogo no BD
    await connection.query(
      `UPDATE rentals SET "returnDate"='${dayjs().format(
        "YYYY-MM-DD"
      )}' WHERE id = $1;`,
      [id]
    );

    // verificar preco por dia de atraso
    let precoAtraso = 0;

    let diasAlugados = (dayjs() - aluguelId[0].rentDate) * (1.1574 * 10 ** -8);
    diasAlugados = Math.round(diasAlugados);

    const diasAtrasados = diasAlugados - aluguelId[0].daysRented;

    const { rows: jogoId } = await connection.query(
      "SELECT * FROM games WHERE id=$1",
      [aluguelId[0].gameId]
    );

    if (diasAtrasados > 0) {
      precoAtraso = diasAtrasados * jogoId[0].pricePerDay;
    }

    // atualizar o preco do valor de atraso
    await connection.query(
      `UPDATE rentals SET "delayFee"='${precoAtraso}' WHERE id = $1;`,
      [id]
    );

    response.status(200).send();
  } catch (error) {
    response.status(500).send();
  }
}

export async function apagarAluguel(request, response) {
  try {
    const { id } = request.params;

    // selecionar o aluguel com o id
    const { rows: aluguelId } = await connection.query(
      `SELECT * FROM rentals WHERE id=${id}`
    );

    // se o id não for encontrado, enviar erro
    if (aluguelId.length === 0) {
      response.status(404).send();
      return;
    }

    // verificar se o aluguel já foi finalizado
    if (aluguelId[0].returnDate === null) {
      response.status(400).send();
      return;
    }

    // deletar o aluguel especificado
    await connection.query("DELETE FROM rentals WHERE id=$1", [id]);

    response.status(200).send();
  } catch (error) {
    response.status(500).send();
  }
}
