const { SendEmailService } = require("../services/send-email.service");
const { MessageConfigService } = require("../services/message-config.service");
const { FailedMessageService } = require("../services/failed_message.service");
const { initSequelize } = require("../libs/sequelize");

const service = new MessageConfigService();
const failedService = new FailedMessageService();

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const retryEmailSending = async () => {
  console.log("Proceso iniciado");
  const models = await initSequelize().then((sequelize) => {
    return sequelize.models;
  });

  service.models = models;
  failedService.models = models;

  const messagesPendingWithErrors = await failedService.findMessageWithErrors();

  if (!messagesPendingWithErrors || messagesPendingWithErrors?.length === 0) {
    console.log("No hay mensajes para reintentar su envio");
    return;
  }

  // console.log(messagesPendingWithErrors);

  //Con esto nos aseguramos de solo trate de enviar mensajes si existen destinarios a los cuales enviar.
  const sendMessages = new SendEmailService(); //Instanciamos una sola vez la clase

  for (const message of messagesPendingWithErrors) {
    const attempts = message.attempts + 1;
    let status = "Retrying";
    const id = message?.id;
    const currentDate = new Date();
    const nestAttemptDate = currentDate.getDate() + 1;
    try {
      await failedService.updateFailedMessage({
        status: status,
        attempts: attempts,
        last_attempt_at: currentDate,
        id: id,
      });

      await sendMessages
        .sendEmail(message)
        .then(async () => {
          status = "sended";
          await service.updateMessagePending(id, status);
          await failedService.updateFailedMessage({ status: status, id: id });
          await failedService.deleteFailedMessage(id);
        })
        .catch(async (error) => {
          if (attempts >= 3) {
            status = "Permanent Failure";
          } else {
            status = "Error";
          }
          await failedService.updateFailedMessage({
            status: status,
            attempts: attempts,
            next_retry_at: nestAttemptDate,
            last_attempt_at: currentDate,
            error_message: error,
            id: id,
          });
        });
    } catch (error) {
      console.log("Ha ocurrido el error: " + error);
    }
    console.log("Esperando 10 segundos");
    await delay(10000);
  }
};

module.exports = { retryEmailSending };
