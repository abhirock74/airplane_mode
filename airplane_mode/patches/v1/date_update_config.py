import frappe
from datetime import now
def execute():
    doc = frappe.get_doc("Shop Management Config", )
    doc.db_set('datetime',now(), commit=True )
    pass