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
         
                    ActiveMP: {
                      key: 1,
                      Desc: "Efectivo",
                      DetCbte: false,
                      FecCbte: false,
                      NroCheq: false,
                      Adjunto: false,
                      FecEmis: false,
                      FecVto: false,
                      BcoEmi: false,
                      BcoDes: false,
                      BcoDesReq: false,
                    },
                    Paso05CantidadRetenciones: 0,
                    Paso05ImporteRetenciones: 0,
                    Paso05PathUpdate: "",
                    Paso06PathUpdate: "",
                    Paso06Detalles: 0,
                    Paso06ImporteDetalle: 0,
                    Recibos: [],                  
                    ActiveRetencion: {
                      Tipokey: "",
                      TipoDesc: "",
                      NCertificado: "",
                      Fecha: null,
                      Importe: "",
                      UpdPath: ""
                    },
                    Retenciones: [],
                    Detalle: [],
                    ActiveDetalle: {
                      MPkey: 0,
                      MPDesc:"",
                      NroCheq: "",
                      NroCte: "",
                      Importe: "",
                      FecEmis: null,
                      FecDepo: null,
                      FecCbte: null,
                      FecVto: null,
                      BcoEmi: "",
                      BcoDes: "",
                      Adjunto: "",
                    },
                    NoComprobantes: false,
                    Resumen: [],
                    SUBTOTAL: "",
                    RESTANTE: "",
                    TOTAL:"",
                    ANTICIPO:"",
                    SALDO:"",
                    ActiveStep:"1",
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