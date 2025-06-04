const db = require('../config/db');

class AvaliacaoService {
  static async criarAvaliacao({ nota, comentario, id_pedido, id_cliente }) {
    try {
      const [result] = await db.query(
        `INSERT INTO avaliacao (data_avaliacao, nota, comentario, id_pedido, id_cliente) VALUES (CURDATE(), ?, ?, ?, ?)`,
        [nota, comentario, id_pedido, id_cliente]
      );
      return { id_avaliacao: result.insertId, nota, comentario, id_pedido, id_cliente, data_avaliacao: new Date().toISOString().slice(0, 10) };
    } catch (error) {
      throw new Error('Erro ao criar avaliação: ' + error.message);
    }
  }

  static async listarAvaliacoes({ semResposta = false } = {}) {
    try {
       
      // INÍCIO ÁREA MODIFICADA - Camilly
      // Alterada a query para incluir JOIN com tabela cliente
      let query = `SELECT a.*, c.nome FROM avaliacao a JOIN cliente c ON a.id_cliente = c.id_cliente`;
      let params = [];
      if (semResposta) {
        // Adicionado prefixo 'a.' para evitar ambiguidade
        query += ' WHERE a.resposta_loja IS NULL OR a.resposta_loja = ""';
        //  FIM ÁREA MODIFICADA
      }t [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw new Error('Erro ao buscar avaliações: ' + error.message);
    }
  }

  static async responderAvaliacao(id_avaliacao, resposta_loja) {
    try {
      const [result] = await db.query(
        `UPDATE avaliacao SET resposta_loja = ? WHERE id_avaliacao = ?`,
        [resposta_loja, id_avaliacao]
      );
      if (result.affectedRows === 0) {
        throw new Error('Avaliação não encontrada');
      }
      return { id_avaliacao, resposta_loja };
    } catch (error) {
      throw new Error('Erro ao responder avaliação: ' + error.message);
    }
  }
}

module.exports = AvaliacaoService;
