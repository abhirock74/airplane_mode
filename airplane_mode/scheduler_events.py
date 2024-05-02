import frappe


def send_rent_reminders():
    active_contract = frappe.get_all("Contract", filters={"status": "Active"})

    for contract in active_contract:
        subject = "Rent Reminder of '{contract.shop}' at '{contract.airport}'"
        message = "Dear {contract.tenant},\n\nThis is a reminder that your rent of Amount: '{contract.rent_amount}' Rupees is due. Please make the payment at your earliest convenience.\n\nThank you."

        frappe.sendmail(recipients=contract.tenant_email, subject=subject, message=message)
