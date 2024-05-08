# Copyright (c) 2023, Management System for Agrasarteach@suvaidyam.com and contributors
# For license information, please see license.txt

import frappe


def execute(filters=None):
    # frappe.errprint(filters.get('airport'))
    columns = [
        {
            "fieldname": "status",
            "label": "Status",
            "fieldtype": "int",
            "width": 200
        },
        {
            "fieldname": "Count",
            "label": "Count",
            "fieldtype": "int",
            "width": 200
        }
    ]

    if filters:
        airport = filters.get('airport')
        airport = frappe.db.escape(airport)
        condition_str = f"WHERE airport = {airport}"
    else:
        condition_str = ""

    sql_query = f"""
        SELECT
            status,
            count(*) AS Count
        FROM
            tabShop
        {condition_str}
        group by status;
    """
    data = frappe.db.sql(sql_query, as_dict=True)
    booked = 0
    available = 0
    for d in data:
        if d.status == 'Occupied':
            booked = d.Count
        else:
            available = d.Count
    return columns, [
        {
            'status':'Available',
            'Count':available
        },
        {
            'status':'Booked',
            'Count':booked
        }
    ]
