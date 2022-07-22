import connection from "../dbStrategy/postgres.js";

export async function listarCategorias(request, response){

    // buscar todas as categorias no BD e enviá-las para o front
    const categorias = await connection.query('SELECT * FROM categories');

    response.send(categorias.rows)
}

export async function inserirCategoria(request, response){
    const novaCategoria = request.body;

    // verificar se a categoria já não foi criada, se sim, retornar erro
    const buscarCategoria = await connection.query(`SELECT * FROM categories WHERE name='${novaCategoria.name}';`)

    if (buscarCategoria.rows.length !== 0){
        response.status(409).send();
        return
    }

    // inserir a nova categoria no BD
    await connection.query(`INSERT INTO categories (name) VALUES ('${novaCategoria.name}');`)

    response.status(201).send()
}
