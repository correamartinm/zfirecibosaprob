sap.ui.define(
  [
    "./BaseController",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.BaseController} Controller
   */
  function (BaseController, Export, ExportTypeCSV) {
    "use strict";

    return BaseController.extend("morixe.zfirecibosaprob.controller.MainView", {
      onInit: function () {
        // this._createUserModel();
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        let oTarget = oRouter.getTarget("TargetMainView");
        oTarget.attachDisplay(this._onObjectMatched, this);
      },

      _onObjectMatched: function () {
        this._onRefreshTable([]);
      },

      onButtonPrintPress: function (params) {},
      // Filtros **************************

      _onRefreshTable: function (oFilter) {
       
        var oTable = this.byId("idTable"); //
        var binding = oTable.getBinding("items");
        binding.filter(oFilter, "Application");
      },

      onFilterBarReset: function () {
        let oView = this.getView(),
          oRazonsocial = oView.byId("idRazonSocialMultiInput"),
          oCuit = oView.byId("idCuitMultiInput"),
          oProcesado = oView.byId("idProcesadoFilter"),
          oFecha = oView.byId("idFechaDateRangeSelection");

        oRazonsocial.removeAllTokens;
        oProcesado.setSelectedKey(null);
        oCuit.removeAllTokens;
        oFecha.setValue(null);
        let oFilter = [];
        var oTable = this.byId("idTable"); 
        oTable.removeSelections();
        this._onRefreshTable(oFilter);
      },

      onFilterBarSearch: function () {
        let oView = this.getView(),
          oFilter = [],
          oRazonsocial = oView.byId("idRazonSocialMultiInput"),
          oProcesado = oView.byId("idProcesadoFilter").getSelectedKey(),
          oCuit = oView.byId("idCuitMultiInput"),
          oRangoFecha = oView.byId("idFechaDateRangeSelection"),
          oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            pattern: "dd/mm/yyyy",
          });

        if (oRazonsocial.getTokens().length !== 0) {
          for (var l = 0; l < oRazonsocial.getTokens().length; l++) {
            oFilter.push(
              new sap.ui.model.Filter(
                "RazonSocial",
                sap.ui.model.FilterOperator.EQ,
                oRazonsocial.getTokens()[l].getKey()
              )
            );
          }
        } else {
          if (oRazonsocial.getValue()) {
            oFilter.push(
              new sap.ui.model.Filter(
                "RazonSocial",
                sap.ui.model.FilterOperator.Contains,
                oRazonsocial.getValue()
              )
            );
          }
        }

        if (oCuit.getTokens().length !== 0) {
          for (var l = 0; l < oCuit.getTokens().length; l++) {
            oFilter.push(
              new sap.ui.model.Filter(
                "Cuit",
                sap.ui.model.FilterOperator.EQ,
                oCuit.getTokens()[l].getKey()
              )
            );
          }
        } else {
          if (oCuit.getValue()) {
            oFilter.push(
              new sap.ui.model.Filter(
                "Cuit",
                sap.ui.model.FilterOperator.Contains,
                oCuit.getValue()
              )
            );
          }
        }

        if (oRangoFecha.getValue().length !== 0) {
          // var oFInicio = oDateFormat.formatoRangoFecha.getDateValue());
          // var oFFin = oDateFormat.format(oRangoFecha.getSecondDateValue());

          oFilter.push(
            new sap.ui.model.Filter(
              "Fecha",
              sap.ui.model.FilterOperator.BT,
              oRangoFecha.getDateValue(),
              oRangoFecha.getSecondDateValue()
            )
          );
        }

        if (oProcesado) {
          if (oProcesado === null) {
            oFilter.push(
              new sap.ui.model.Filter(
                "Procesado",
                sap.ui.model.FilterOperator.EQ,
                ""
              )
            );
          } else {
            oFilter.push(
              new sap.ui.model.Filter(
                "Procesado",
                sap.ui.model.FilterOperator.EQ,
                oProcesado
              )
            );
          }
        }

        // let AllFilter = new sap.ui.model.Filter(oFilter, true);

        this._onRefreshTable(oFilter);
        console.log(oFilter);
      },
      onSearchRS: function (oEvent) {
        let oTable = oEvent.getSource().getParent().getParent(),
          oTarget = oEvent.getSource(),
          oFilters = [],
          oValue = oEvent.getSource().getValue();

        if (oValue.length >= 0) {
          oFilters.push(
            new Filter("RazonSocial", FilterOperator.Contains, oValue)
          );
        } else {
          oEvent.getSource().setValue();

          // MessageToast.show(sMessage);

          jQuery.sap.delayedCall(300, this, function () {
            oTarget.focus();
          });
        }
        oTable.getBinding("items").filter([oFilters]);
      },

      onTableSelectionChange: function () {
        let oTable = this.getView().byId("idTable"),
          oMockModel = this.getView().getModel("mockdata"),
          oItems = oTable.getItems(),
          oSelectedItems = oTable.getSelectedItems();

        oMockModel.setProperty("/Items", oItems.length);
        oMockModel.setProperty("/SelectedItems", oSelectedItems.length);
      },

      onPostSelection: function () {
        let oTable = this.getView().byId("idTable"),
          oMockModel = this.getView().getModel("mockdata"),
          oModel = this.getOwnerComponent().getModel(),
          vObject,
          oPath,
          oItems = oTable.getSelectedItems();

        if (oItems.length > 0) {
          for (var index = 0; index < oItems.length; index++) {
            oPath = oItems[index].getBindingContextPath();
            vObject = oModel.getObject(oPath);

            if (oItems[index].getSelected() === true) {
              vObject.Accion = "P";
              this.onPostPress(vObject);
              oModel.refresh(true);
              this._onRefreshTable();
            }
          }
        }
      },

      onAnultSelection: function () {
        let oTable = this.getView().byId("idTable"),
          oMockModel = this.getView().getModel("mockdata"),
          oModel = this.getOwnerComponent().getModel(),
          vObject,
          oPath,
          oItems = oTable.getSelectedItems();

        if (oItems.length > 0) {
          for (var index = 0; index < oItems.length; index++) {
            oPath = oItems[index].getBindingContextPath();
            vObject = oModel.getObject(oPath);

            if (oItems[index].getSelected() === true) {
              vObject.Accion = "A";
              this.onPostPress(vObject);
              oModel.refresh(true);
              this._onRefreshTable();
            }
          }
        }
      },

      // *** Post

      onDetailPress: function (oEvent) {
        let Model = this.getOwnerComponent().getModel(),
          oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oPath = oEvent.getSource().getBindingContext().getPath(),
          oItem = oEvent.getSource().getBindingContext().getObject();
        oMockModel.setProperty("/ReciboActivo", oItem);
        this.getOwnerComponent().getTargets().display("TargetDetalle");
      },

      // ******************************************************
      // Descarga *********************************************

      onDownloadMessage: function () {
        let oMockModel = this.getOwnerComponent().getModel("mockdata"),
          items = oMockModel.getProperty("/SelectedItems");

        if (items > 0) {
          let objectMsg = {
            titulo: this._i18n().getText("descargafile"),
            mensaje: this._i18n().getText("msgdownload"),
            icono: sap.m.MessageBox.Icon.QUESTION,
            acciones: [
              this._i18n().getText("btnseleccion"),
              this._i18n().getText("btntodos"),
              sap.m.MessageBox.Action.CLOSE,
            ],
            resaltar: this._i18n().getText("btnseleccion"),
          };

          this._onShowMsgBox(objectMsg).then((rta) => {
            switch (rta) {
              case "CLOSE":
                break;

              case this._i18n().getText("btnseleccion"):
                this.onDownloadSelection();

                break;

              case this._i18n().getText("btntodos"):
                this.onDownloadAll();
                break;
            }
          });
        } else {
          this.onDownloadAll();
        }
      },
      onDownloadAll: function () {
        let oEntity = "/RECIBOSSet",
          oModel = this.getOwnerComponent().getModel(),
          oColumns = this.oClumnsCreations(),
          oFilename = this._i18n().getText("appTitle");

        oModel.setSizeLimit(999999);
        this.onDownloadFile(oModel, oEntity, oColumns, oFilename);
      },

      onDownloadSelection: function () {
        let oTable = this.getView().byId("idTable"),
          oMockModel = this.getView().getModel("mockdata"),
          oColumns = this.oClumnsCreations(),
          oModel = this.getOwnerComponent().getModel(),
          vObject,
          oPath,
          data = [],
          oItems = oTable.getSelectedItems();

        if (oItems.length > 0) {
          for (var index = 0; index < oItems.length; index++) {
            oPath = oItems[index].getBindingContextPath();
            vObject = oModel.getObject(oPath);
            data.push(vObject);
          }
        }

        oMockModel.setProperty("/PrintData", data);
        let oFilename = this._i18n().getText("appTitle"),
          oEntity = "/PrintData";

        this.onDownloadFile(oMockModel, oEntity, oColumns, oFilename);
      },

      oClumnsCreations: function () {
        let oColumns = [
          {
            name: this._i18n().getText("lblnumero"), //"Nombres",
            template: { content: "{Numero}" },
          },
          {
            name: this._i18n().getText("lblfecha"), //"Nombres",
            template: { content: "{Fecha}" },
          },
          {
            name: this._i18n().getText("lblrazonsocial"), //"Nombres",
            template: { content: "{RazonSocial}" },
          },
          {
            name: this._i18n().getText("lblcuit"), //"Nombres",
            template: { content: "{Cuit}" },
          },
          {
            name: this._i18n().getText("lbltotalrecibo"), //"Nombres",
            template: { content: "{Total}" },
          },

          {
            name: this._i18n().getText("lblmoneda"), //"Nombres",
            template: { content: "{Moneda}" },
          },
          {
            name: this._i18n().getText("lblprocesado"), //"Nombres",
            template: { content: "{Procesado}" },
          },
          {
            name: this._i18n().getText("lblfechaproceso"), //"Nombres",
            template: { content: "{FechaProcesado}" },
          },
        ];

        return oColumns;
      },

      onDownloadFile: function (oModel, oEntity, oColumns, oFilename) {
        let oExport = new Export({
          exportType: new ExportTypeCSV({
            fileExtension: "csv",
            separatorChar: ";",
          }),
          models: oModel,
          rows: { path: oEntity }, // Ejemplo "/AccountReportSet"
          columns: oColumns,
        });
        // console.log(oExport);
        oExport
          .saveFile(oFilename)
          .catch(function (oError) {
            console.log(oError);
          })
          .then(function () {
            oExport.destroy();
          });
      },
    });
  }
);
