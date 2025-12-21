const x = document.getElementById("box");
const elee5IPTd = $('.e5IPTd');
const eleVOYwb = $('.VOYwb');
const elelWI5Pb = $('.lWI5Pb');
const eleXyWBof = $('.XyWBof');
const eleEiVpKc = $('.EiVpKc');
	
function openChatBox(e) {
	
    
    if (x.classList.contains('open')) {
      x.classList.remove("open");
	  elee5IPTd.removeClass(`e5IPTd-forcar-hover`);
	  eleVOYwb.removeClass(`VOYwb-forcar-hover`);
	  elelWI5Pb.removeClass(`lWI5Pb-forcar-hover`);
	  eleXyWBof.removeClass(`XyWBof-forcar-hover`);
	  eleEiVpKc.removeClass(`EiVpKc-forcar-hover`);	  
    } else {
      x.classList.add("open");
	  elee5IPTd.addClass(`e5IPTd-forcar-hover`);
	  eleVOYwb.addClass(`VOYwb-forcar-hover`);
	  elelWI5Pb.addClass(`lWI5Pb-forcar-hover`);
	  eleXyWBof.addClass(`XyWBof-forcar-hover`);
	  eleEiVpKc.addClass(`EiVpKc-forcar-hover`);	  
      document.getElementById("user-input").focus();
    }
  }
  
window.addEventListener('click', function(e) {

  const btnAbrir = document.querySelector('button.VYBDae-JX-I'); // substitua pela classe/id do seu ícone de chat

  // Se o box estiver aberto E o clique NÃO for dentro do box E NÃO for no botão que abre
  if (box.classList.contains('open') && 
      !box.contains(e.target) && 
      (!btnAbrir || !btnAbrir.contains(e.target))) {
    
    box.classList.remove("open");
    elee5IPTd.removeClass(`e5IPTd-forcar-hover`);
    eleVOYwb.removeClass(`VOYwb-forcar-hover`);
    elelWI5Pb.removeClass(`lWI5Pb-forcar-hover`);
    eleXyWBof.removeClass(`XyWBof-forcar-hover`);
    eleEiVpKc.removeClass(`EiVpKc-forcar-hover`);
  }
});