sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/Sorter",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.BaseController} Controller
   */
  function (BaseController, Sorter, Export, ExportTypeCSV) {
    "use strict";

    return BaseController.extend("morixe.zfirecibosaprob.controller.MainView", {
      onInit: function () {
        // this._createUserModel();
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        let oTarget = oRouter.getTarget("TargetMainView");
        oTarget.attachDisplay(this._onObjectMatched, this);
      },

      _i18n: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },

      _onObjectMatched: function () {
        this._onRefreshTable([]);
        this.getOwnerComponent().getModel().setSizeLimit("20000");
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
          oVendedor = oView.byId("idVendedorMultiInput"),
          oNumero = oView.byId("idnumeroMultiInput"),
          oProcesado = oView.byId("idProcesadoFilter"),
          oFecha = oView.byId("idFechaDateRangeSelection");

        oRazonsocial.removeAllTokens();
        oNumero.removeAllTokens();
        oVendedor.removeAllTokens();
        oCuit.removeAllTokens();

        oNumero.setValue("");
        oRazonsocial.setValue("");
        oVendedor.setValue("");

        oProcesado.setSelectedKey(null);
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
          oVendedor = oView.byId("idVendedorMultiInput"),
          oNumero = oView.byId("idnumeroMultiInput"),
          oProcesado = oView.byId("idProcesadoFilter").getSelectedKey(),
          oCuit = oView.byId("idCuitMultiInput"),
          oRangoFecha = oView.byId("idFechaDateRangeSelection"),
          oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
            UTC: false,
          });

        if (oNumero.getTokens().length !== 0) {
          let ofnum = new Array();
          for (var l = 0; l < oNumero.getTokens().length; l++) {
            ofnum.push(
              new sap.ui.model.Filter(
                "Numero",
                sap.ui.model.FilterOperator.EQ,
                oNumero.getTokens()[l].getKey()
              )
            );
          }
          oFilter.push(new sap.ui.model.Filter(ofnum, false));
        } else {
          if (oNumero.getValue()) {
            oFilter.push(
              new sap.ui.model.Filter(
                "Numero",
                sap.ui.model.FilterOperator.EQ,
                oNumero.getValue()
              )
            );
          }
        }




        if (oVendedor.getTokens().length !== 0) {
          var orFilterSTF = [];
          for (var l = 0; l < oVendedor.getTokens().length; l++) {
            orFilterSTF.push(
              new sap.ui.model.Filter(
                "Vendedor",
                sap.ui.model.FilterOperator.EQ,
                oVendedor.getTokens()[l].getKey()
              )
            );
          }
          oFilter.push(new sap.ui.model.Filter(orFilterSTF, false));
        } else {
          if (oVendedor.getValue()) {
            var orFilterSTF2 = [];
            orFilterSTF2.push(
              new sap.ui.model.Filter(
                "Vendedor",
                sap.ui.model.FilterOperator.Contains,
                oVendedor.getValue().toUpperCase()
              )
            );
            orFilterSTF2.push(
              new sap.ui.model.Filter(
                "Vendedor",
                sap.ui.model.FilterOperator.EQ,
                oVendedor.getValue().toUpperCase()
              )
            );

            orFilterSTF2.push(
              new sap.ui.model.Filter(
                "Vendedor",
                sap.ui.model.FilterOperator.Contains,
                oVendedor.getValue()
              )
            );
            orFilterSTF2.push(
              new sap.ui.model.Filter(
                "Vendedor",
                sap.ui.model.FilterOperator.EQ,
                oVendedor.getValue()
              )
            );
            oFilter.push(new sap.ui.model.Filter(orFilterSTF2, false));
          }
        }

        if (oRazonsocial.getTokens().length !== 0) {
          var orFilterRS = [];
          for (var l = 0; l < oRazonsocial.getTokens().length; l++) {
            orFilterRS.push(
              new sap.ui.model.Filter(
                "RazonSocial",
                sap.ui.model.FilterOperator.EQ,
                oRazonsocial.getTokens()[l].getKey()
              )
            );
          }
          oFilter.push(new sap.ui.model.Filter(orFilterRS, false));
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
          var orFilterCuit = [];
          for (var l = 0; l < oCuit.getTokens().length; l++) {
            orFilterCuit.push(
              new sap.ui.model.Filter(
                "Cuit",
                sap.ui.model.FilterOperator.EQ,
                oCuit.getTokens()[l].getKey()
              )
            );
          }
          oFilter.push(new sap.ui.model.Filter(orFilterCuit, false));
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
          var oFInicio = oDateFormat.format(oRangoFecha.getDateValue());
          var oFFin = oDateFormat.format(oRangoFecha.getSecondDateValue());

          let fini = new Date(oRangoFecha.getDateValue() + "GMT");
          let ffin = new Date(oRangoFecha.getSecondDateValue() + "GMT");

          oFilter.push(
            new sap.ui.model.Filter(
              "Fecha",
              sap.ui.model.FilterOperator.BT,
              fini,
              ffin
            )
          );
        }

        if (oProcesado) {
          if (oProcesado === "N" || oProcesado === "") {
            var orFilterPro = [];
            oFilter.push(
              new sap.ui.model.Filter(
                "Procesado",
                sap.ui.model.FilterOperator.NE,
                "V"
              )
            );
            // oFilter.push( new sap.ui.model.Filter( "Procesado",  sap.ui.model.FilterOperator.NE,  "A" ) );
            // oFilter.push(new sap.ui.model.Filter(orFilterPro, false));
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

        let AllFilter = new sap.ui.model.Filter(oFilter, true);

        this._onRefreshTable(AllFilter);
        // console.log(AllFilter);
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

      onTableSelection: function () {
        let oTable = this.getView().byId("idTable"),
          oMockModel = this.getView().getModel("mockdata"),
          oSelectedItems = oTable.getSelectedItems(),
          oItems = oTable.getItems();

        oMockModel.setProperty("/Items", oItems.length);
        oMockModel.setProperty("/SelectedItems", oSelectedItems.length);
      },

      onTableSelectionChange: function (oEvent) {
        let oTable = this.getView().byId("idTable"),
          oMockModel = this.getView().getModel("mockdata"),
          oModel = this.getOwnerComponent().getModel(),
          oItems = oTable.getItems();

        let oItem = oEvent.getParameters("listItem"),
          oPath = oItem.listItem.getBindingContextPath(),
          vObject = oModel.getObject(oPath);

        for (var index = 0; index < oItems.length; index++) {
          oPath = oItems[index].getBindingContextPath();
          vObject = oModel.getObject(oPath);

          if (vObject.Procesado !== "") {
            oItems[index].setSelected() === false;
          }
        }

        this.onTableSelection();
      },

      onPostSelection: async function () {
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
              await this.onPostPress(vObject);
              //this._onRefreshTable();
            }
          }
        }

        oModel.refresh(true);
        let oData = oMockModel.getProperty("/RtaData");
        if (oData.length > 0) {
          this._informationDialog();
        }
      },

      onAnultSelection: async function () {
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
              await this.onPostPress(vObject);

              // this._onRefreshTable();
            }
          }
        }

        oModel.refresh(true);
        let oData = oMockModel.getProperty("/RtaData");
        if (oData.length > 0) {
          this._informationDialog();
        }
      },

      onButtonPrintPress: function (oEvent) {
        let oPath = oEvent.getSource().getBindingContext().getPath(),
          oModel = this.getOwnerComponent().getModel(),
          oView = this.getView(),
          oItem = oEvent.getSource().getBindingContext().getObject();

        var oData = {
          Codigo: oItem.Numero,
        };

        oView.setBusy(true);
        oModel.callFunction("/PrintDoc", {
          method: "GET",
          urlParameters: oData,

          success: jQuery.proxy(function (oData) {
            oView.setBusy(false);

            if (oData.PrintDoc.URL) {
              let url =
                window.location.protocol +
                "//" +
                window.location.host +
                oData.PrintDoc.URL;

              window.open(url);
            }
          }, this),
          error: jQuery.proxy(function (oError) {
            oView.setBusy(false);

            MessageToast.show(that.getResourceBundle().getText("printError"));
          }, this),
        });
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

      // Ordenamiento

      openConfigDialog: function () {
        if (!this._tableConfigDialog) {
          this._tableConfigDialog = sap.ui.xmlfragment(
            "morixe.zfirecibosaprob.view.fragments.TableConfigDialog",
            this
          );
          this.getView().addDependent(this._tableConfigDialog);
        }
        this._tableConfigDialog.open();
      },

      handleSortDialogConfirm: function (oEvent) {
        var oTable = this.byId("idTable"),
          mParams = oEvent.getParameters(),
          oBinding = oTable.getBinding("items"),
          sPath,
          bDescending,
          aSorters = new Array();

        sPath = mParams.sortItem.getKey();
        bDescending = mParams.sortDescending;
        aSorters.push(new Sorter(sPath, bDescending));

        // apply the selected sort and group settings
        oBinding.sort(aSorters);
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
