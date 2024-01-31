sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/MessageBox",
    "sap/ui/core/ValueState",
    "sap/ui/core/routing/History",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
  ],
  function (
    Controller,
    Dialog,
    Button,
    mobileLibrary,
    MessageBox,
    ValueState,
    History,
    FilterOperator,
    Filter
  ) {
    "use strict";
    var ButtonType = mobileLibrary.ButtonType;
    var DialogType = mobileLibrary.DialogType;

    return Controller.extend(
      "morixe.zfirecibosaprob.controller.BaseController",
      {
        formatNumber: function (value) {
          if (!value) return 0;

          let ovalue = parseFloat(value);
          return ovalue;
        },
        formatState: function (value) {
          if (!value) return "Error";

          let ovalue = parseFloat(value);
          if (ovalue > 0) {
            return "Warning";
          } else {
            return "Success";
          }
        },

        //  Detalle
        formatUrl: function (ID, Name) {
          let srv = "/sap/opu/odata/sap/ZGWFI_COBRANZAS_APROB_SRV/",
            id = "AttachDocSet(Codigo='" + ID + "',",
            file = "Filename='" + Name;
            let rta = srv + id + file + "')/$value";
            return rta;
            
        },

        formatIconBool: function (param) {
          switch (param) {
            case "X":
              return "accept";

              break;
            case "A":
              return "sys-cancel";

              break;

            default:
              return "border";
              break;
          }
        },

        formatCurrency: function (param) {
          let oValue,
            oCurrencyFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance(
              { currencyCode: false }
            );
  
          if (param) {
            oValue = oCurrencyFormat.format(param);
            return oValue;
          } else {
            return param;
          }
        },

        formatText: function (param) {
          switch (param) {
            case "X":
              return this._i18n().getText("btnprocesado");

              break;
            case "A":
              return this._i18n().getText("btnanulado");

              break;

            default:
              return "";
              break;
          }
        },

        formatStateBool: function (param) {
          switch (param) {
            case "X":
              return "Success";

              break;
            case "A":
              return "Error";

              break;

            default:
              return "None";
              break;
          }
        },
        // ********************************************
        // Ficheros *******************
        // ********************************************

        onButtonAtachPressREC: function (oEvent) {
          let oItem = [];
          let oMockModel = this.getOwnerComponent().getModel("mockdata");
          if (oEvent.getSource().getBindingContext() !== undefined) {
            oItem = oEvent.getSource().getBindingContext().getObject();
            oMockModel.setProperty("/Paso01Cliente", oItem);
          }
          oMockModel.setProperty("/FileParameters", oItem);
          var oFilter = new Filter("Recibo", FilterOperator.EQ, oItem.Numero);
          this.onFileDialog(oFilter, oItem);
        },    

        
        onButtonAtachPressRET: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata");
          let oFilter = new Array;
          ReciboActivo
          let oItem = oMockModel.getProperty("/ReciboActivo");
          oFilter.push(new Filter("Recibo", FilterOperator.EQ, oItem.Numero));
          oFilter.push(new Filter("Tipo", FilterOperator.EQ, "RETE"));
          this.onFileDialog(oFilter, oItem);
        },        

        onButtonAtachPressDET: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata");
          let oFilter = new Array;
          let oItem = oMockModel.getProperty("/ReciboActivo");
          oFilter.push(new Filter("Recibo", FilterOperator.EQ, oItem.Numero));
          oFilter.push(new Filter("Tipo", FilterOperator.EQ, "DETA"));
          this.onFileDialog(oFilter, oItem);
        },        
        onButtonAtachPressDES: function () {
          let oMockModel = this.getOwnerComponent().getModel("mockdata");
          let oFilter = new Array;
          let oItem = oMockModel.getProperty("/ReciboActivo");
          oFilter.push(new Filter("Recibo", FilterOperator.EQ, oItem.Numero));
          oFilter.push(new Filter("Tipo", FilterOperator.EQ, "DESC"));
          this.onFileDialog(oFilter, oItem);
        },

        onFileDialog: function (oFilter, oItem) {
        

          if (!this._oDialogUploadSet) {
            this._oDialogUploadSet = sap.ui.xmlfragment(
              "UploadFile",
              "morixe.zfirecibosaprob.view.fragments.FileUploader",
              this
            );
            this.getView().addDependent(this._oDialogUploadSet);
          }

          // Filtro Ficheros

          var oUploadCollection = sap.ui.core.Fragment.byId(
            "UploadFile",
            "attachmentUpl"
          );
          // var oFilter = new Filter("Recibo", FilterOperator.EQ, oItem.Numero);

          let oBinding = oUploadCollection.getBinding("items");
          oBinding.filter(oFilter);

          // Muestro Dialogo

          this._oDialogUploadSet.setTitle(
            "Cliente: " + oItem.Cliente + " Numero: " + oItem.Numero
          );
          this._oDialogUploadSet.open();
        },

        onCloseonFileDialog: function () {
          this._oDialogUploadSet.close();
          this._oDialogUploadSet.destroy();
          this._oDialogUploadSet = null;
        },

        onSelectAllAttachments: function (oEvent) {
          var aUploadedItems = sap.ui.core.Fragment.byId(
              "UploadFile",
              "attachmentUpl"
            ).getItems(),
            bSelected = oEvent.getSource().getSelected();
          if (bSelected) {
            //if CheckBox is selected
            aUploadedItems.forEach((oItem) =>
              oItem.getListItem().setSelected(true)
            );
            sap.ui.core.Fragment.byId("UploadFile", "download").setEnabled(
              true
            );
          } else {
            aUploadedItems.forEach((oItem) =>
              oItem.getListItem().setSelected(false)
            );
            sap.ui.core.Fragment.byId("UploadFile", "remove").setEnabled(false);
            sap.ui.core.Fragment.byId("UploadFile", "download").setEnabled(
              false
            );
          }
        },
        onSelectionChangeAttachment: function () {
          if (
            sap.ui.core.Fragment.byId("UploadFile", "attachmentUpl")
              .getList()
              .getSelectedItems().length > 0
          ) {
            //if user selects 1 or more uploaded item

            sap.ui.core.Fragment.byId("UploadFile", "remove").setEnabled(true);
            sap.ui.core.Fragment.byId("UploadFile", "download").setEnabled(
              true
            );
          } else {
            sap.ui.core.Fragment.byId("UploadFile", "remove").setEnabled(false);
            sap.ui.core.Fragment.byId("UploadFile", "download").setEnabled(
              false
            );
          }
        },
        onRemove: function (oEvent) {
          var oAttachmentUpl = sap.ui.core.Fragment.byId(
            "UploadFile",
            "attachmentUpl"
          );
          oAttachmentUpl.setBusy(true);
          let that = this;
          oAttachmentUpl.getItems().forEach((oItem) => {
            if (oItem.getListItem().getSelected()) {
              var sPath = oItem.getProperty("url").split("SRV")[1]; //eg /Z9NRS_REQ_ATTACHSet
              this.getView()
                .getModel()
                .remove(sPath, {
                  success: function () {
                    oAttachmentUpl.removeItem(oItem); //remove from displayed list
                  },
                  error: function (oError) {
                    that.parseErrorMsg();
                  },
                });
            }
          });
          oEvent.getSource().setEnabled(false);
          sap.ui.core.Fragment.byId("UploadFile", "download").setEnabled(false);

          if (oAttachmentUpl.getItems().length > 0) {
            sap.ui.core.Fragment.byId("UploadFile", "checkbox").setVisible(
              true
            );
          } else {
            sap.ui.core.Fragment.byId("UploadFile", "checkbox").setVisible(
              false
            );
          }
          oAttachmentUpl.setBusy(false);
        },
        onDownload: function (oEvent) {
          let 
          oMockModel = this.getOwnerComponent().getModel("mockdata"),
          File = oMockModel.getProperty("/FileParameters"),
            oAttachmentUpl = sap.ui.core.Fragment.byId(
              "UploadFile",
              "attachmentUpl"
            );
  
          oAttachmentUpl.setBusy(true);
          oAttachmentUpl.getItems().forEach((oItem) => {
            if (oItem.getListItem().getSelected()) {
              let uri = this.formatUrl(File.Recibo, oItem.getFileName());
              oItem.setUrl(uri);
              oItem.download(true);
              oItem.getListItem().setSelected(false);
            }
          });
          oAttachmentUpl.setBusy(false);
          oEvent.getSource().setEnabled(false);
        },
        onStartUpload: function () {
          var oAttachmentUpl = sap.ui.core.Fragment.byId(
            "UploadFile",
            "attachmentUpl"
          );

          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            paso1 = oMockModel.getProperty("/Paso01Cliente");

          var aIncompleteItems = oAttachmentUpl.getIncompleteItems();
          this.iIncompleteItems = aIncompleteItems.length;
          if (this.iIncompleteItems !== 0) {
            oAttachmentUpl.setBusy(true);
            this.i = 0; //used to turn off busy indicator when all uploads complete
            for (var i = 0; i < this.iIncompleteItems; i++) {
              var sFileName = aIncompleteItems[i].getProperty("fileName");
              var oXCSRFToken = new sap.ui.core.Item({
                key: "X-CSRF-Token",
                text: this.getOwnerComponent().getModel().getSecurityToken(),
              });
              var oSlug = new sap.ui.core.Item({
                key: "SLUG",
                text: paso1.Numero || "" + "/" + sFileName,
              });
              oAttachmentUpl.addHeaderField(oXCSRFToken).addHeaderField(oSlug);
              // .uploadItem(aIncompleteItems[i]);
              oAttachmentUpl.removeAllHeaderFields();
            }
          }
        },
        onUploadCompleted: function () {
          this.i += 1;
          if (this.i === this.iIncompleteItems) {
            //turn off busy indicator when all attachments have completed uploading
            sap.ui.core.Fragment.byId("UploadFile", "attachmentUpl").setBusy(
              false
            );
          }
          console.log("Fichero Cargado");
        },
        parseErrorMsg: function (oError) {
          //parses oData error messages dependent on different return values
          var oMessage, sType;
          if (oError.response) {
            //for update
            sType = typeof oError.response;
            if (sType === "string" || sType === "object")
              oMessage = JSON.parse(oError.response.body).error.message.value;
            else
              return MessageBox.error(
                "Unhandled server error:\n\n" +
                  oError.response +
                  "\n\nReport this issue to Admin for a future fix."
              );
          } else if (oError.responseText) {
            //for create
            sType = typeof oError.responseText;
            if (sType === "string" || sType === "object")
              oMessage = JSON.parse(oError.responseText).error.message.value;
            else
              return MessageBox.error(
                "Unhandled server error:\n\n" +
                  oError.responseText +
                  "\n\nReport this issue to Admin for a future fix."
              );
          } else if (!oError)
            return MessageToast.show("Error message is undefined");
          MessageBox.error(oMessage);
        },

        // ********************************************
        // Actualizacion de Modelos  ******************
        // ********************************************

        onPostPress: async function (oItem) {
          let oModel = this.getOwnerComponent().getModel(),
            oMockModel = this.getOwnerComponent().getModel("mockdata"),
            oEntidad = "/RECIBOSSet",
            oView = this.getView();

          let OldData = oMockModel.getProperty("/RtaData");
          let oPayload = {
            Numero: oItem.Numero,
            Accion: oItem.Accion,
          };

          let rta = await this._oncreateModel(
            oModel,
            oView,
            oEntidad,
            oPayload
          );

          if (rta.Respuesta !== "OK") {
            this._onErrorHandle(rta.Datos);
          } else {
            console.log(rta);
            // RtaData
            oMockModel.setProperty("/RtaData", OldData.concat(rta.Datos));
          }
        },

        _oncreateModel: function (oModel, oView, oEntity, oPayload) {
          return new Promise((resolve, reject) => {
            oView.setBusy(true);
            let that = this;
            oModel.create(oEntity, oPayload, {
              success: function (oData) {
                oView.setBusy(false);
                resolve({ Respuesta: "OK", Datos: oData });
                oModel.refresh(true);
              }.bind(this),

              error: function (oError) {
                oView.setBusy(false);
                resolve({ Respuesta: "ERROR", Datos: oError });
                // Reiniciar
              }.bind(this),
            });
          });
        },

        onCheckStep: function (oEvent) {
          let Entidad = oEvent.oSource.sPath;

          // registros = oEvent.mParameters.data.results.length;

          // if (registros === 0) {
          //   this._wizard.invalidateStep(this.getView().byId(step));
          // } else {
          //   this._wizard.validateStep(this.getView().byId(step));
          // }
        },

        _onSaveData: async function (oModel, oView, item) {
          let oMockModel = this.getOwnerComponent().getModel("mockdata"),
            paso1 = oMockModel.getProperty("/Paso01Cliente");

          if (item.Aplicado) {
            item.Importe = item.Aplicado;
          }

          // TipoComprobante

          let oPayload = {
            Codigo: item.Codigo || "",
            Cliente: paso1.Codigo || "",
            TipoLinea: item.TipoLinea || "",
            Descripcion: item.Descripcion || "",
            NroLinea: item.NroLinea.toString() || "",
            Importe: item.Importe.toString() || "",
            Numero: item.Numero.toString() || "",
            Fecha: item.Fecha || new Date(),
            Documentacion: item.Documentacion || "",
            Mensaje: item.Mensaje || "",
            Resultado: item.Resultado || "",
            Detalle: item.Detalle || "",
            NroCheque: item.NroCheque || "",
            FechaEmision: item.FechaEmision || null,
            FechaVencimiento: item.FechaVencimiento || null,
            BancoEmisor: item.BancoEmisor || "",
            BancoDestino: item.BancoDestino || "",
            TipoComprobante: item.Tipo || paso1.TipoComprobante,
            Periodo: item.Periodo || "",
            Sociedad: item.Sociedad || "",
          };

          let oEntidad = "/DocumenPosSet";
          console.log(oPayload);
          let rta = await this._oncreateModel(
            oModel,
            oView,
            oEntidad,
            oPayload
          );

          return rta;
        },

        _informationDialog: function () {
          //
          if (!this.oDefaultDialog) {
            this.oDefaultDialog = new sap.m.Dialog({
              title: this._i18n().getText("resumentitle"),
              content: new sap.m.List({
                items: {
                  path: "mockdata>/RtaData",
                  template: new sap.m.StandardListItem({
                    title:
                      this._i18n().getText("lblrecibo") +
                      ": " +
                      "{mockdata>Numero}" +
                      "  " +
                      this._i18n().getText("lblprocesado") +
                      ": " +
                      "{mockdata>Resultado}",
                    description: "{mockdata>Mensaje}",
                  }),
                },
              }),
              beginButton: new sap.m.Button({
                type: ButtonType.Emphasized,
                text: this._i18n().getText("btnvolver"),
                press: function () {
                  this.oDefaultDialog.close();
                  this.getOwnerComponent()
                    .getModel("mockdata")
                    .setProperty("/RtaData", []);
                    this.getOwnerComponent().getTargets().display("TargetMainView");
                }.bind(this),
              }),
            });

            this.getView().addDependent(this.oDefaultDialog);
          }

          this.oDefaultDialog.open();
        },

        _i18n: function () {
          return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        // Actualizacion Modelos -------------------

        onupdateModel: function (oModel, oView, oPath, oPayload) {
          return new Promise((resolve, reject) => {
            oView.setBusy(true);
            oModel.update(oPath, oPayload, {
              success: function (oData) {
                oView.setBusy(false);

                if (oData.Tipo === "E") {
                  // Error
                } else {
                  resolve({ Respuesta: "OK", Datos: oData });
                  oModel.refresh(true);
                  // Correcto
                }
              }.bind(this),

              error: function (oError) {
                oView.setBusy(false);
                resolve({ Respuesta: "ERROR", Datos: oError });
                // Reiniciar
              }.bind(this),
            });
          });
        },

        ondeleteModel: function (oModel, oView, oPath) {
          return new Promise((resolve, reject) => {
            oView.setBusy(true);
            oModel.remove(oPath, {
              method: "DELETE",
              success: function (oData) {
                oView.setBusy(false);
                resolve({ Respuesta: "OK", Datos: oData });
                oModel.refresh(true);
              },
              error: function (oError) {
                oView.setBusy(false);
                resolve({ Respuesta: "ERROR", Datos: oError });
              },
            });
          });
        },

        _onreadModel: function (oModel, oView, oPath) {
          return new Promise((resolve, reject) => {
            let that = this;
            oView.setBusy(true);
            oModel.read(oPath, {
              success: jQuery.proxy(function (oData) {
                oView.setBusy(false);
                resolve({ Respuesta: "OK", Datos: oData });
              }, this),
              error: function (oError) {
                oView.setBusy(false);
                resolve({ Respuesta: "ERROR", Datos: oError });
              },
            });
          });
        },

        _onfilterModel: function (oModel, oView, oEntity, oFilters) {
          return new Promise((resolve, reject) => {
            oView.setBusy(true);
            oModel.read(oEntity, {
              filters: [oFilters],
              success: jQuery.proxy(function (oData) {
                oView.setBusy(false);
                resolve(oData);
              }, this),
              error: function (oError) {
                oView.setBusy(false);
              },
            });
          });
        },

        // Mensajeria -----------------------

        _onErrorHandle: function (oError) {
          // if (oError.Mensaje === undefined) {
          //   var oErrorMsg = JSON.parse(oError.responseText);
          //   var oText = oErrorMsg.error.message.value;
          // } else {
          //   var oText = oError.Mensaje;
          // }

          var sMessageTitle = this._i18n().getText("msgerror");

          let objectMsg = {
            titulo: sMessageTitle,
            mensaje: oError.responseText,

            icono: sap.m.MessageBox.Icon.ERROR,
            acciones: [sap.m.MessageBox.Action.CLOSE],
            resaltar: sap.m.MessageBox.Action.CLOSE,
          };

          this._onShowMsgBox(objectMsg).then((rta) => {});
        },

        _onShowMsgBox: function (MsgObj) {
          return new Promise((resolve, reject) => {
            MessageBox.show(MsgObj.mensaje, {
              icon: MsgObj.icono,
              title: MsgObj.titulo,
              onClose: function (oAction) {
                resolve(oAction);
              }.bind(this),
              styleClass:
                "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer",
              actions: MsgObj.acciones,
              emphasizedAction: MsgObj.resaltar,
            });
          });
        },
      }
    );
  }
);
