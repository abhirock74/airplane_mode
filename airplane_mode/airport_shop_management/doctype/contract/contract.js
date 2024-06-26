// Copyright (c) 2023, abhishek kumar and contributors
// For license information, please see license.txt
function callAPI(options) {
    return new Promise((resolve, reject) => {
      frappe.call({
        ...options,
        callback: async function (response) {
          resolve(response?.message || response?.value)
        }
      });
    })
}
function apply_filter(frm) {
  frm.fields_dict['shop'].get_query = () => {
    return {
      filters: {
        'Airport':frm.doc.airport || "Select Airport",
        'status':'available'
      },
      page_length: 1000
    };
  }
};
frappe.ui.form.on("Contract", {
	async refresh(frm) {
        apply_filter(frm)
        if(frm.is_new()){
            try {
                let data = await callAPI({
                   method: 'frappe.client.get',
                    args: {
                        txt:'',
                        doctype:"Shop Management Config",
                        reference_doctype: "Shop Management Config",
                        filters: {}
                    },
                    freeze_message: __("Getting config"),
                })
                frm.set_value('rent_amount',data.shop_default_rent)
                frm.set_value('security_deposit',data.shop_default_security_deposit)

                frm.set_value('from_date',new Date())
                let today = new Date();
                today.setFullYear(today.getFullYear() + 1);
                frm.set_value('to_date',today)

                // frappe.msgprint("It's new!!",JSON.stringify(data))
            } catch (error) {
                frappe.throw(error.message)
            }
        }
	},
  airport:(frm)=>{
      apply_filter(frm)
  }
});

frappe.ui.form.on('Rent Payment', {
  form_render: async function (frm, cdt, cdn) {
  },
  payment_add: function(frm,cdt,cdn) {
    let row = frappe.get_doc(cdt, cdn);
    row.amount = frm.doc.rent_amount;
    frm.refresh_field("payment");
  },
  payment_date:(frm, cdt, cdn)=>{
    let row = frappe.get_doc(cdt, cdn);
    let paid = frm.doc.payment.find(f=> !f.__islocal && row.payment_date && (f.payment_date.slice(0, 7) == row.payment_date.slice(0, 7)) )
    if(paid){
      row.payment_date = '';
      frm.refresh_field("payment_date");
      frappe.throw(`You have already make payment for this month.`)
    }
  }
});

