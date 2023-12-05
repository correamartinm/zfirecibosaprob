sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/ValueState",
    "sap/ui/core/routing/History",
  ],
  function (Controller, MessageBox, ValueState, History) {
    "use strict";

    return Controller.extend(
      "morixe.zfirecibosaprob.controller.BaseController",
      {
        _onUpdateModel: function (oModel, entity, values) {
          oModel.setProperty(entity, values);
        },

        _onGetDataModel: function (model, entity) {
          if (model) {
            let data = model.getProperty(entity);
            return data;
          }
        },

        _onFocusControl: function (oControl) {
          jQuery.sap.delayedCall(600, this, function () {
            oControl.focus;
          });
        },
        formatItem: function (text, value) {
          if (!text) {
            return "";
          } else {
            let ovalue = parseFloat(value);
            if (text.toUpperCase() === "SALDO" && value !== "") {
              this.getOwnerComponent()
                .getModel("mockdata")
                .setProperty("/SALDO", value);
            }
          }
          return value;
        },

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


        formatIconBool: function (param) {
          if (param === "X") {
            return "accept";
          } else {
            return "decline";
          }
        },

        formatStateBool: function (param) {
          if (param === "X") {
            return "Success";
          } else {
            return "Error";
          }
        },
      // ********************************************
      // Ficheros *******************
      // ********************************************

      onFileDialog: function (oEvent) {
        let oItem = [];
        let oMockModel = this.getOwnerComponent().getModel("mockdata");
        if (oEvent.getSource().getBindingContext() !== undefined) {
          oItem = oEvent.getSource().getBindingContext().getObject();
          oMockModel.setProperty("/Paso01Cliente", oItem);
        } else {
          let paso1 = oMockModel.getProperty("/Paso01Cliente");
          oItem.Cliente = paso1.Cliente;
          oItem.Numero = paso1.Numero;
        }

        if (!this._oDialogUploadSet) {
          this._oDialogUploadSet = sap.ui.xmlfragment(
            "UploadFile",
            "morixe.zfirecibos.view.fragments.FileUploader",
            this
          );
          this.getView().addDependent(this._oDialogUploadSet);
        }

        // Filtro Ficheros

        var oUploadCollection = sap.ui.core.Fragment.byId(
          "UploadFile",
          "attachmentUpl"
        );
        var oFilter1 = new Filter("Cliente", FilterOperator.EQ, oItem.Cliente);
        var oFilter2 = new Filter("NroLinea", FilterOperator.EQ, oItem.Numero);

        // if (oUploadCollection.getItems().length.length > 0) oUploadCollection.getBinding("items").filter([oFilter1 ,oFilter2]);

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
          sap.ui.core.Fragment.byId("UploadFile", "download").setEnabled(true);
        } else {
          aUploadedItems.forEach((oItem) =>
            oItem.getListItem().setSelected(false)
          );
          sap.ui.core.Fragment.byId("UploadFile", "remove").setEnabled(false);
          sap.ui.core.Fragment.byId("UploadFile", "download").setEnabled(false);
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
          sap.ui.core.Fragment.byId("UploadFile", "download").setEnabled(true);
        } else {
          sap.ui.core.Fragment.byId("UploadFile", "remove").setEnabled(false);
          sap.ui.core.Fragment.byId("UploadFile", "download").setEnabled(false);
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
          sap.ui.core.Fragment.byId("UploadFile", "checkbox").setVisible(true);
        } else {
          sap.ui.core.Fragment.byId("UploadFile", "checkbox").setVisible(false);
        }
        oAttachmentUpl.setBusy(false);
      },
      onDownload: function (oEvent) {
        var oAttachmentUpl = sap.ui.core.Fragment.byId(
          "UploadFile",
          "attachmentUpl"
        );
        oAttachmentUpl.setBusy(true);
        oAttachmentUpl.getItems().forEach((oItem) => {
          if (oItem.getListItem().getSelected()) {
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
              text: paso1.Cliente + "/" + paso1.Tipo || "" + "/" + sFileName,
            });
            oAttachmentUpl.addHeaderField(oXCSRFToken).addHeaderField(oSlug);
            // .uploadItem(aIncompleteItems[i]);
            // oAttachmentUpl.removeAllHeaderFields();
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

        _oncreateModelNew: function (oModel, oView, oEntity, oPayload) {
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

        _i18n: function () {
          return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        // *************************
        // Ficheros



        onFileDialog: function (oEvent) {
          let oPath = oEvent.getSource().getBindingContext().getPath(),
            oItem = oEvent.getSource().getBindingContext().getObject();
          if (!this._oDialogUploadSet) {
            this._oDialogUploadSet = sap.ui.xmlfragment(
              "UploadFile",
              "morixe.zfirecibosaprob.view.fragments.FileUploader",
              this
            );
            this.getView().addDependent(this._oDialogUploadSet);
          }

          // Filtro Ficheros
          // var oUploadCollection = sap.ui.core.Fragment.byId("UploadFile", "attachmentUpl");
          // var oFilter2 = new Filter("Recibo", FilterOperator.EQ, gOrder);

          // oUploadCollection.getBinding("items").filter([oFilter2]);
          // Muestro Dialogo

          // this._oDialogUploadSet.setTitle("Ficheros Ficha: " + gOrder + " Intervencion: " + gNumIntervencion);
          this._oDialogUploadSet.open();
        },

        onSelectAllAttachments: function (oEvent) {
          var aUploadedItems = sap.ui.core.Fragment.byId(
          "UploadFile",
          "attachmentUpl").getItems(),
            bSelected = oEvent.getSource().getSelected();
          if (bSelected) {
            //if CheckBox is selected
            aUploadedItems.forEach((oItem) =>
              oItem.getListItem().setSelected(true)
            );
            this.byId("download").setEnabled(true);
          } else {
            aUploadedItems.forEach((oItem) =>
              oItem.getListItem().setSelected(false)
            );
            this.byId("remove").setEnabled(false);
            this.byId("download").setEnabled(false);
          }
        },
        onSelectionChangeAttachment: function () {
          if (
            sap.ui.core.Fragment.byId(
          "UploadFile",
          "attachmentUpl").getList().getSelectedItems().length > 0
          ) {
            //if user selects 1 or more uploaded item
            this.byId("remove").setEnabled(true);
            this.byId("download").setEnabled(true);
          } else {
            this.byId("remove").setEnabled(false);
            this.byId("download").setEnabled(false);
          }
        },
        onRemove: function (oEvent) {
          var oAttachmentUpl = sap.ui.core.Fragment.byId(
          "UploadFile",
          "attachmentUpl");

          oAttachmentUpl.setBusy(true);
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
          this.byId("download").setEnabled(false);

          if (oAttachmentUpl.getItems().length > 0) {
            this.byId("checkbox").setVisible(true);
          } else {
            this.byId("checkbox").setVisible(false);
          }
          oAttachmentUpl.setBusy(false);
        },
        onDownload: function (oEvent) {
          var oAttachmentUpl = sap.ui.core.Fragment.byId(
          "UploadFile",
          "attachmentUpl");
          oAttachmentUpl.setBusy(true);
          oAttachmentUpl.getItems().forEach((oItem) => {
            if (oItem.getListItem().getSelected()) {
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
          "attachmentUpl");
          var aIncompleteItems = oAttachmentUpl.getIncompleteItems();
          this.iIncompleteItems = aIncompleteItems.length; //used to turn off busy indicator upon completion of all pending uploads
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
                text: this.sRequestId + "/" + sFileName,
              });
              oAttachmentUpl
                .addHeaderField(oXCSRFToken)
                .addHeaderField(oSlug)
                .uploadItem(aIncompleteItems[i]);
              oAttachmentUpl.removeAllHeaderFields(); //at least slug header field must be reset after each upload
            }
          }
        },
        onUploadCompleted: function () {
          this.i += 1;
          if (this.i === this.iIncompleteItems) {
            //turn off busy indicator when all attachments have completed uploading
            sap.ui.core.Fragment.byId(
          "UploadFile",
          "attachmentUpl").setBusy(false);
          }
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

        // Files Individual ------------------------

        OnFileUploadMethod: function (FileUploader, oValue) {
          var that = this;
          FileUploader.addHeaderParameter(
            new sap.ui.unified.FileUploaderParameter({
              name: "slug",
              value: oValue,
            })
          );

          // var sAttachmentURL = oModel.sServiceUrl + oModel.createKey("/AttachDocSet", {
          //   ticketNumber: oData.ticketNumber
          //   }) + "/attachments";

          FileUploader.setSendXHR(true);
          // FileUploader.setUploadUrl(sAttachmentURL);
          FileUploader.upload();
          FileUploader.setValue("");
          FileUploader.removeAllHeaderParameters();

          // FileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
          //   name: "x-csrf-token",
          //   value: that.getOwnerComponent().getModel("oVendorChangeRequest").getSecurityToken()
          // }));
        },

        // Actualizacion Modelos -------------------

        _oncreateModel: function (oModel, oView, oEntity, oPayload) {
          return new Promise((resolve, reject) => {
            oView.setBusy(true);
            oModel.create(oEntity, oPayload, {
              success: function (oData) {
                oView.setBusy(false);

                resolve(oData);
              }.bind(this),

              error: function (oError) {
                oView.setBusy(false);
                resolve(oError);
                // Reiniciar
              }.bind(this),
            });
          });
        },

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
                resolve({ Rta: "OK", Data: oData });
              }, this),
              error: function (oError) {
                oView.setBusy(false);
                resolve({ Rta: "ERROR", Data: oError });
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

        _onShowMsgBoxConfirm: function (sMessage, sMessageTitle) {
          return new Promise((resolve, reject) => {
            MessageBox.confirm(sMessage, {
              icon: MessageBox.Icon.QUESTION,
              title: sMessageTitle,
              onClose: function (oAction) {
                resolve(oAction);
              }.bind(this),
              styleClass: "",
              actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
              emphasizedAction: MessageBox.Action.OK,
            });
          });
        },

        _onErrorHandle: function (oError) {
          if (oError.Mensaje === undefined) {
            var oErrorMsg = JSON.parse(oError.responseText);
            var oText = oErrorMsg.error.message.value;
          } else {
            var oText = oError.Mensaje;
          }

          var sMessageTitle = this._i18n().getText("msgerror");

          let objectMsg = {
            titulo: sMessageTitle,
            mensaje: oText,
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

        _onShowMsgBoxError: function (sMessage, sMessageTitle) {
          return new Promise((resolve, reject) => {
            MessageBox.error(sMessage, {
              icon: MessageBox.Icon.ERROR,
              title: sMessageTitle,
              onClose: function (oAction) {
                resolve(oAction);
              }.bind(this),
              styleClass: "",
              actions: MessageBox.Action.CLOSE,
              emphasizedAction: MessageBox.Action.CLOSE,
            });
          });
        },

        _onShowMsgBoxSucces: function (sMessage, sMessageTitle) {
          return new Promise((resolve, reject) => {
            MessageBox.success(sMessage, {
              icon: MessageBox.Icon.SUCCESS,
              title: sMessageTitle,
              onClose: function (oAction) {
                resolve(oAction);
              }.bind(this),
              styleClass: "",
              actions: sap.m.MessageBox.Action.OK,
              emphasizedAction: sap.m.MessageBox.Action.OK,
            });
          });
        },
      }
    );
  }
);
