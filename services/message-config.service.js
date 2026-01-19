// const { initSequelize } = require("../libs/sequelize");
const { Op } = require("sequelize");

class MessageConfigService {
  constructor(models) {
    this.models = models;
  }

  async findMessagePending() {
    const rta = await this.models.MessageConfig.findAll({
      where: {
        status: "pending",
        scheduled_date: { [Op.lte]: new Date() },
        MessageId: { [Op.not]: null },
        // id: 761,
      },
      attributes: [
        "recipient",
        ["message", "message_content"],
        "MessageId",
        "scheduled_date",
        "id",
        "UserId",
      ],
      order: [["created_at", "ASC"]],
      raw: true,
    });
    return rta;
  }

  async findMessagesWithError() {
    const now = new Date();

    // Restar 5 minutos a la hora actual para considerar el atraso
    const delay = new Date(now.getTime() - 5 * 60000); // 5 minutos en milisegundos

    // Buscar mensajes con estado "error" y cuya scheduled_date esté entre la hora actual y el margen de atraso
    const rta = await this.models.MessageConfig.findAll({
      where: {
        status: "error",
        scheduled_date: {
          [Op.between]: [delay, now], // Rango entre el margen de atraso y la hora actual
        },
        attempts: { [Op.lt]: 3 },
      },
      attributes: [
        "recipient",
        ["message", "message_content"],
        "message_id",
        "scheduled_date",
        "id",
      ],
    });

    console.log(rta);
    return rta;
  }

  async updateMessagePending(id, status) {
    const rta = await this.models.MessageConfig.update(
      { status: status },
      { where: { id: id } }
    );
    return rta;
  }
}

module.exports = { MessageConfigService };
