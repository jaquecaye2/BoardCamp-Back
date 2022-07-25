import connection from "../dbStrategy/postgres.js";

export async function listarJogos(request, response) {
  // pegar a query string passada e tratar ela
  /*const name = request.query.name

    console.log(name)*/

  // buscar todos os jogos do BD
  const { rows: games } = await connection.query("SELECT * FROM games");

  const gamesCompleto = [];

  // para cada jogo listado, buscar qual a categoria desse jogo e inserir o nome como parte do objeto
  for (let i = 0; i < games.length; i++) {
    const { rows: buscarCategoria } = await connection.query(
      `SELECT * FROM categories WHERE id='${games[i].categoryId}';`
    );

    const gameCompleto = {
      ...games[i],
      categoryName: buscarCategoria[0].name,
    };

    gamesCompleto.push(gameCompleto);
  }

  // responder no final com a lista de jogos atualizada
  response.send(gamesCompleto);
}

export async function inserirJogo(request, response) {
  const novoJogo = request.body;

  // verificar se a categoria do jogo existe, e caso não exista, emitir erro
  let { rows: buscarCategoria } = await connection.query(
    `SELECT * FROM categories WHERE id='${novoJogo.categoryId}';`
  );

  if (buscarCategoria.length === 0) {
    response.status(400).send();
    return;
  }

  // verificar se o nome do jogo existe, e caso exista, emitir erro
  const buscarNome = await connection.query(
    `SELECT * FROM games WHERE name='${novoJogo.name}';`
  );

  if (buscarNome.rows.length !== 0) {
    response.status(409).send();
    return;
  }

  // inserir o novo jogo no banco de dados
  await connection.query(
    `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ('${novoJogo.name}', '${novoJogo.image}', '${novoJogo.stockTotal}', '${novoJogo.categoryId}', '${novoJogo.pricePerDay}');`
  );

  response.status(201).send();
}
