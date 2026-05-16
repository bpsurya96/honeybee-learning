function submitContactForm(){
  const name=document.getElementById('cfParent').value.trim();
  const msg=document.getElementById('cfMessage').value.trim();
  const err=document.getElementById('cfError');
  if(!name||!msg){
    err.textContent='⚠️ Please fill in your name and message.';
    err.style.display='block';
    return;
  }
  err.style.display='none';
  const age=document.getElementById('cfChildAge').value;
  const product=document.getElementById('cfProduct').value;
  const text=`Hi! Quick Enquiry:\nName: ${name}\nChild Age: ${age||'Not mentioned'}\nProduct: ${product||'Not selected'}\nMessage: ${msg}`;
  window.open('https://wa.me/918883624873?text='+encodeURIComponent(text),'_blank');
}
