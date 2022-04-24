import $ from 'jquery'

export const contactHome = () => {
  $(function() {
    const Address = $('#address')
    const AddressIcon = $('#address .address-icon')
    const AdressContect = $('#address .address-contect')
    const text = AddressIcon.text()
    if(text && text.length >= 22) {
    Address.on('mouseover',() => {
        AddressIcon.css('display','block')
        AdressContect.css('cursor','pointer')
    })
    Address.on('mouseout', () => {
      AddressIcon.css('display','none')
    })
    }
  })
}
