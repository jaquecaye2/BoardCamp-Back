import connection from "../dbStrategy/postgres.js";

export async function listarCategorias(request, response){

    const categorias = await connection.query('SELECT * FROM categories');

    response.send(categorias.rows)
}

export async function inserirCategoria(request, response){
    const novaCategoria = request.body;

    const buscarCategoria = await connection.query(`SELECT * FROM categories WHERE name='${novaCategoria.name}';`)

    if (buscarCategoria.rows.length !== 0){
        response.status(409).send();
        return
    }

    await connection.query(`INSERT INTO categories (name) VALUES ('${novaCategoria.name}');`)

    response.status(201).send()
}
