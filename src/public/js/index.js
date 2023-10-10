//con este socket vamos a establecer la comunicacion con nuestro servidor
const socket = io(); // LADO CLIENTE

// Swal.fire(
//     'Saludos!',
//     'Mensaje de bienvenida!',
//     'success'
//   )

// Modal de autentificacion
// Swal.fire({
//     title: 'Login Form',
//     html: `<input type="text" id="login" class="swal2-input" placeholder="Username">
//     <input type="password" id="password" class="swal2-input" placeholder="Password">`,
//     confirmButtonText: 'Sign in',
//     focusConfirm: false,
//     preConfirm: () => {
//       const login = Swal.getPopup().querySelector('#login').value
//       const password = Swal.getPopup().querySelector('#password').value
//       if (!login || !password) {
//         Swal.showValidationMessage(`Please enter login and password`)
//       }
//       return { login: login, password: password }
//     }
//   }).then((result) => {
//     Swal.fire(`
//       Login: ${result.value.login}
//       Password: ${result.value.password}
//     `.trim())
//   })

let user;
const chatBox = document.getElementById("chat");
const messagesLog = document.getElementById("messageLogs");

Swal.fire({
  title: "Identificate",
  input: "text",
  text: "Ingresa el usuario para identificarte en el chat",
  inputValidator: (value) => {
    return !value && "Necesitas escribir nombre de usuario";
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
}).then((result) => {
  user = result.value;
  socket.emit("authenticated", user);
});

chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", data => {
  let messages = "";
  data.forEach((message) => {
    messages += `${message.user} dice: ${message.message}</br>`;
  });
  messagesLog.innerHTML = messages;
});

socket.on('newUserConnected', data => {
  Swal.fire({
    toast: true, //modal en parte superior derecha
    position: 'top-end',
    showConfirmationButton: false,
    timer: 3000, // segundos en milisegundos
    title: `${data} se ha conectado al chat`,
    icon: 'succes',


  })
})
