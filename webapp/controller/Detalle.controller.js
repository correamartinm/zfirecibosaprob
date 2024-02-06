sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/ui/core/ValueState",
    "sap/m/Dialog",
    "sap/m/Button",
    "../libs/Download",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    BaseController,
    FilterOperator,
    Filter,
    ValueState,
    Dialog,
    Button,
    Download,
    MessageToast
  ) {
    let rtaP2, rtaP3, rtaP4, rtaP5, rtaP6;
    ("use strict");

    return BaseController.extend("morixe.zfirecibosaprob.controller.Detalle", {
      onInit: function () {
        this._wizard = this.byId("idWizard");

        this._oNavContainer = this.byId("wizardNavContainer");
        this._oWizardContentPage = this.byId("idRecibosPage");
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        let oTarget = oRouter.getTarget("TargetDetalle");
        oTarget.attachDisplay(this._onObjectMatched, this);
      },

      _onObjectMatched: function () {
        this.onBuscarCliente();
      },

      _onClearTable: function (oTable, column) {
        let oItems = oTable.getSelectedItems();

        if (oItems.length > 0) {
          for (var index = 0; index < oItems.length; index++) {
            oItems[index].getCells()[column].setEnabled(false);
            oItems[index].getCells()[column].setValue();
          }
        }

        oTable.removeSelections();
      },

      onClearData: function () {
        let oMockModel = this.getView().getModel("mockdata");
        // oMockModel.setProperty("/Paso01Cliente", {});

        // oMockModel.setProperty("/Descuentos", []);
        // oMockModel.setProperty("/Detalle", []);
        // oMockModel.setProperty("/ActiveStep", "1");

        // oMockModel.setProperty("/SUBTOTAL", "");
        // oMockModel.setProperty("/RESTANTE", "");
        // oMockModel.setProperty("/TOTAL", "");
        // oMockModel.setProperty("/ANTICIPO", "");
        // oMockModel.setProperty("/SALDO", "");
        // oMockModel.setProperty("/Paso04PathUpdate", "");
        // oMockModel.setProperty("/Paso05PathUpdate", "");
        // oMockModel.setProperty("/Paso06PathUpdate", "");
      },

      // ************ Control de los Pasos ****************

      // ********************************************
      // Paso Datos del Cliente
      // ********************************************
      onBuscarCliente: async function () {
        let oMockModel = this.getView().getModel("mockdata"),
          oRecibo = oMockModel.getProperty("/ReciboActivo"),
          oModel = this.getOwnerComponent().getModel(),
          oView = this.getView();
        oPath = oModel.createKey("/CLIENTESSet", {
          Codigo: oRecibo.Cliente,
        });

        let rta = await this._onreadModel(oModel, oView, oPath);

        if (rta.Respuesta !== "OK") {
          this._onErrorHandle(rta.Datos);
        } else {
          oMockModel.setProperty("/Paso01Cliente", rta.Datos);
          this.onFilterTables(oRecibo);
        }
      },

      onFilterTables: function (Recibo) {
        let oView = this.getView(),
          oModel = this.getOwnerComponent().getModel(),
          TablaPagosaCta = oView.byId("idPagoCtaTable"),
          TablaComprobantes = oView.byId("idComprobanteTable"),
          TablaDescuentos = oView.byId("idDescuentosTable"),
          TableRetenciones = oView.byId("idRetencionesTable"),
          TablaMediosPagosa = oView.byId("idPagosSetTable"),
          ListResumen = oView.byId("idResumenSetList"),
          oFiltersACTA = [],
          oFiltersRETE = [],
          oFiltersCBTE = [],
          oFiltersDESC = [],
          oFiltersDETA = [],
          oFiltersRESU = [],
          oFilters = [];

        oModel.refresh(true);

        oFiltersACTA.push(new Filter("Tipo", FilterOperator.EQ, "ACTA"));
        oFiltersACTA.push(
          new Filter("Codigo", FilterOperator.EQ, Recibo.Numero)
        );
        oFiltersACTA.push(
          new Filter("Cliente", FilterOperator.EQ, Recibo.Cliente)
        );
        TablaPagosaCta.getBinding("items").filter(oFiltersACTA);

        oFiltersRETE.push(new Filter("TipoLinea", FilterOperator.EQ, "RETE"));
        oFiltersRETE.push(
          new Filter("Numero", FilterOperator.EQ, Recibo.Numero)
        );
        oFiltersRETE.push(
          new Filter("Cliente", FilterOperator.EQ, Recibo.Cliente)
        );
        TableRetenciones.getBinding("items").filter(oFiltersRETE);

        oFiltersDESC.push(new Filter("TipoLinea", FilterOperator.EQ, "DESC"));
        oFiltersDESC.push(
          new Filter("Codigo", FilterOperator.EQ, Recibo.Numero)
        );
        oFiltersDESC.push(
          new Filter("Cliente", FilterOperator.EQ, Recibo.Cliente)
        );
        TablaDescuentos.getBinding("items").filter(oFiltersDESC);

        oFiltersDETA.push(new Filter("TipoLinea", FilterOperator.EQ, "DETA"));
        oFiltersDETA.push(
          new Filter("Codigo", FilterOperator.EQ, Recibo.Numero)
        );
        oFiltersDETA.push(
          new Filter("Cliente", FilterOperator.EQ, Recibo.Cliente)
        );
        TablaMediosPagosa.getBinding("items").filter(oFiltersDETA);

        oFiltersCBTE.push(new Filter("Tipo", FilterOperator.EQ, "APLIC"));
        oFiltersCBTE.push(
          new Filter("Codigo", FilterOperator.EQ, Recibo.Numero)
        );
        oFiltersCBTE.push(
          new Filter("Cliente", FilterOperator.EQ, Recibo.Cliente)
        );
        TablaComprobantes.getBinding("items").filter(oFiltersCBTE);

        oFiltersRESU.push(
          new Filter("Codigo", FilterOperator.EQ, Recibo.Numero)
        );
        ListResumen.getBinding("items").filter(oFiltersRESU);

        // console.log(oFiltersRESU);
      },

      onDetailItemPress: function (oEvent) {
        let Model = this.getOwnerComponent().getModel(),
          oLayModel = this.getOwnerComponent().getModel("layout"),
          oPath = oEvent.getSource().getBindingContext().getPath(),
          oItem = oEvent.getSource().getBindingContext().getObject();

        oLayModel.setProperty("/activePanel", oItem.TipoLinea);
      },

      onOcultarPanel: function () {
        let oLayModel = this.getOwnerComponent().getModel("layout"),
          ListaReview = this.getView().byId("idResumenSetList");
        oLayModel.setProperty("/activePanel", "");
        ListaReview.removeSelections();
        //
      },

      onContabilizarINDV: async function () {
        let oMockModel = this.getView().getModel("mockdata"),
          oRecibo = oMockModel.getProperty("/ReciboActivo");

        oRecibo.Accion = "P";
        await this.onPostPress(oRecibo);
        this.getOwnerComponent().getModel().refresh(true);
        let oData = oMockModel.getProperty("/RtaData");
        if (oData.length > 0) {
          this._informationDialog();
        }
      },

      onAnularINDV: async function () {
        let oMockModel = this.getView().getModel("mockdata"),
          oRecibo = oMockModel.getProperty("/ReciboActivo");
        oRecibo.Accion = "A";
        await this.onPostPress(oRecibo);
        this.getOwnerComponent().getModel().refresh(true);
        let oData = oMockModel.getProperty("/RtaData");
        if (oData.length > 0) {
          this._informationDialog();
        }
      },

 

      // ***********************************************
      // **************** Navegacion *******************
      // ***********************************************

      // ********************************************
      // Impresion *****************************
      // ********************************************

      onPrint: function (oTk, oStd) {
        var oModel = this.getView().getModel(),
          oKey = oModel.createKey("/ImpresionSet", {
            Numero: oTk,
            Estado: oStd,
          });

        oModel.read(oKey, {
          success: function (oData) {
            if (oData2.Tipo !== "E") {
              window.open(oData.Url);
            }
          }.bind(this),
          error: function (oError) {
            MessageBox.information("ERROR EN IMPRESION");
          },
        });
      },

      onConfirmarReciboButtonPress: async function () {
        let oMockModel = this.getView().getModel("mockdata"),
          oEntidad = "/DocumentosSet",
          oModel = this.getOwnerComponent().getModel(),
          oView = this.getView(),
          oSubTotal = oMockModel.getProperty("/TOTAL");
        oData = oMockModel.getProperty("/Paso01Cliente");

        oData.Accion = "S";

        let oPayload = {
          Cliente: oData.Codigo,
          Comentarios: oData.Observaciones,
          Accion: oData.Accion,
          TipoComprobante: oData.TipoComprobante,
          Total: oSubTotal.toString(),
        };

        let rta2 = await this._oncreateModel(oModel, oView, oEntidad, oPayload);

        if (rta2.Mensaje) {
          let sMessage = rta2.Mensaje,
            sMessageTitle = this._i18n().getText("msgok");

          this._onShowMsgBoxSucces(sMessage, sMessageTitle).then((rta) => {
            oMockModel.setProperty("/NoComprobantes", false);

            this.getOwnerComponent().getTargets().display("TargetMainView");
            oModel.refresh();
          });
        }
      },

      onNavBack: async function () {
        this.getOwnerComponent().getTargets().display("TargetMainView");

        // let sMessage = this._i18n().getText("msgcancel"),
        //   oMockModel = this.getView().getModel("mockdata"),
        //   sMessageTitle = this._i18n().getText("msgvolver");

        // let objectMsg = {
        //   titulo: sMessageTitle,
        //   mensaje: sMessage,
        //   icono: sap.m.MessageBox.Icon.QUESTION,
        //   acciones: [sap.m.MessageBox.Action.NO, sap.m.MessageBox.Action.YES],
        //   resaltar: sap.m.MessageBox.Action.NO,
        // };

        // this._onShowMsgBox(objectMsg).then((rta) => {
        //   if (rta === "YES")
        //     this.getOwnerComponent().getTargets().display("TargetMainView");
        // });
      },
    });
  }
);
