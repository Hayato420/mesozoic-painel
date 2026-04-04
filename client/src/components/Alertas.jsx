import Swal from 'sweetalert2'
import "./Alertas.css"

//ALERTAS
export const alerta = Swal.mixin({
  customClass: {
    popup: 'alertaPopup',
    title: 'alertaTitulo',
    htmlContainer: 'alertaConteudo',
    confirmButton: 'alertaBotao',
    cancelButton: 'alertaBotao',
  },
  showClass: {
    popup: ''//sem animação de entrada
  },
  hideClass: {
    popup: ''//sem animação de saída
  },
  buttonsStyling: false,

  allowOutsideClick: false,//não fecha se clicar fora
  
  didOpen: () => {
    const confirmBtn = document.querySelector('.swal2-confirm')
    const cancelBtn = document.querySelector('.swal2-cancel')
    if (confirmBtn && cancelBtn){//"gap", caso haja 2 botões(confirm e cancel)
      confirmBtn.style.marginRight = '20px'
    }
  }
})