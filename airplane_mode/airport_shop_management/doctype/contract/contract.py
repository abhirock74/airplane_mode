# Copyright (c) 2023, abhishek kumar and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Contract(Document):
	def on_update(self):
		frappe.db.set_value("Shop", self.shop, 'status','Occupied', update_modified=False)
		pass
