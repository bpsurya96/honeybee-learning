function submitSchoolForm(){
  const school=document.getElementById('scSchool').value.trim();
  const contact=document.getElementById('scContact').value.trim();
  const phone=document.getElementById('scPhone').value.trim();
  const err=document.getElementById('scError');
  if(!school||!contact||!phone){
    err.textContent='⚠️ Please fill in school name, contact person and phone.';
    err.style.display='block';
    return;
  }
  if(!/^\d{10}$/.test(phone.replace(/\s/g,''))){
    err.textContent='⚠️ Please enter a valid 10-digit number.';
    err.style.display='block';
    return;
  }
  err.style.display='none';
  const qty=document.getElementById('scQty').value;
  const product=document.getElementById('scProduct').value;
  const msg=document.getElementById('scMsg').value.trim();
  const text=`Hi! School Enquiry:\nSchool: ${school}\nContact: ${contact}\nPhone: ${phone}\nQty: ${qty||'Not specified'}\nProduct: ${product||'Not specified'}\nDetails: ${msg||'None'}`;
  window.open('https://wa.me/918883624873?text='+encodeURIComponent(text),'_blank');
}
