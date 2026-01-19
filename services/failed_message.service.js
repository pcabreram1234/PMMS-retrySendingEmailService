require("dotenv").config();
const { Op, Sequelize } = require("sequelize");

class FailedMessageService {
  constructor(models) {
    this.models = models;
  }
  async findMessageWithErrors() {
    const d = new Date();
    const retryLimit = new Date(d.getTime() + 20 * 60000);
    const rta = await this.models.FailedMessage.findAll({
      where: {
        status: { [Op.or]: ["Error", "Pending"] },
        next_retry_at: {
          [Op.or]: [null, { [Op.lte]: retryLimit }],
        },
        attempts: {
          [Op.lt]: 3,
        },
      },
      attributes: [
        "id",
        "recipient",
        "message_content",
        "attempts",
        "status",
        "last_attempt_at",
        "next_retry_at",
      ],
      order: [[Sequelize.literal("last_attempt_at"), "ASC"]],
      limit: parseInt(process.env.MAIL_SEND_PER_DAY_LIMIT),
    });
    return rta;
  }

  async updateFailedMessage(data) {
    const {
      status,
      attempts,
      next_retry_at,
      last_attempt_at,
      error_message,
      id,
    } = data;

    const updateData = {};

    if (status !== undefined) updateData.status = status;
    if (attempts !== undefined) updateData.attempts = attempts;
    if (next_retry_at !== undefined) updateData.next_retry_at = next_retry_at;
    if (last_attempt_at !== undefined)
      updateData.last_attempt_at = last_attempt_at;
    if (error_message !== undefined) updateData.error_message = error_message;

    const rta = await this.models.FailedMessage.update(updateData, {
      where: {
        id: id,
      },
    });
    return rta;
  }

  async findOneMessageWithError(data) {
    const { message_id, scheduled_date, recipient } = data;
    const rta = await this.models.FailedMessage.findOne({
      where: {
        message_id: message_id,
        scheduled_date: scheduled_date,
        recipient: recipient,
        status: { [Op.notIn]: ["Sended"] },
      },
      attributes: ["message_id", "id", "scheduled_date", "attempts"],
    });
    return rta;
  }

  async createNewMessageWithError(data) {
    const rta = await this.models.FailedMessage.create(data);
    return rta;
  }

  async deleteFailedMessage(id) {
    const rta = await this.models.FailedMessage.destroy({
      where: {
        id: id,
      },
    });
    return rta;
  }
}

module.exports = { FailedMessageService };
