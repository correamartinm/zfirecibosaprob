/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "morixe/zfirecibosaprob/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("morixe.zfirecibosaprob.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                var oMockDataModel = new sap.ui.model.json.JSONModel({
                    Paso01Cliente: {
                      Codigo: "",
                      RazonSocial: "",
                      Domicilio: "",
                      Localidad: "",
                      Cuit: "",
                      TipoIva: "",
                      Observaciones: "",
                      Accion: "",
                      Anticipo: false,
                      Recibo: false,
                      TipoComprobante:"",
                      Completo: false
                    },
                    SelectedItems:"",
                    Items: "",
                    PrintData: [],
                    ReciboActivo: {}
          
            
                  });
                  this.setModel(oMockDataModel, "mockdata");
          
                  var oLayoutModel = new sap.ui.model.json.JSONModel({
                    descuentosadd: false,
                    EdicionRecibo: true,
                    retencionesadd: false,
                    detalleadd: false,
                    controlrecibo: false,
                    MpKey: 1,
                    RsKey: 0,
                  });
                  this.setModel(oLayoutModel, "layout");
            }
        });
    }
);