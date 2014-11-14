/**
 *
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    Volker Theile <volker.theile@openmediavault.org>
 * @copyright Copyright (c) 2009-2013 Volker Theile
 * @copyright Copyright (c) 2014 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/form/Panel.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")

Ext.define("OMV.module.admin.service.gateone.Settings", {
    extend : "OMV.workspace.form.Panel",
    uses   : [
        "OMV.data.Model",
        "OMV.data.Store"
    ],

    rpcService   : "GateOne",
    rpcGetMethod : "getSettings",
    rpcSetMethod : "setSettings",

    plugins      : [{
        ptype        : "linkedfields",
        correlations : [{
            conditions : [
                { name : "enable", value : true }
            ],
            properties : function(valid, field) {
                this.setButtonDisabled("webclient", !valid);
            }
        }]
    }],

    initComponent : function() {
        var me = this;

        me.on('load', function () {
            var checked = me.findField('enable').checked;
            var parent = me.up('tabpanel');

            if (!parent)
                return;

            var webPanel = parent.down('panel[title=' + _("Terminal") + ']');

            if (webPanel) {
                checked ? webPanel.enable() : webPanel.disable();
            }
        });

        me.callParent(arguments);
    },

    getButtonItems : function() {
        var me = this;
        var items = me.callParent(arguments);
        items.push({
            id       : me.getId() + "-webclient",
            xtype    : "button",
            text     : _("Web Client"),
            icon     : "images/gateone.png",
            iconCls  : Ext.baseCSSPrefix + "btn-icon-16x16",
            disabled : true,
            scope    : me,
            handler  : function () {
                var link = "https://" + location.hostname + ":8777/gateone/";
                window.open(link, '_blank');
            }
        });
        return items;
    },

    getFormItems : function() {
        var me = this;
        return [{
            xtype         : "fieldset",
            title         : _("General settings"),
            fieldDefaults : {
                labelSeparator : ""
            },
            items         : [{
                xtype      : "checkbox",
                name       : "enable",
                fieldLabel : _("Enable"),
                checked    : false
            },{
                xtype      : "textfield",
                name       : "origins",
                fieldLabel : _("Origins"),
                value      : "\"" + location.hostname + "\""
            }]
        }];
    }
});

OMV.WorkspaceManager.registerPanel({
    id        : "settings",
    path      : "/service/gateone",
    text      : _("Settings"),
    position  : 10,
    className : "OMV.module.admin.service.gateone.Settings"
});
