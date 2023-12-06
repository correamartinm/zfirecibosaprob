sap.ui.define(
  ["./BaseController"],
  /**
   * @param {typeof sap.ui.core.mvc.BaseController} Controller
   */
  function (BaseController) {
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

        oRazonsocial.setValue(null);
        oProcesado.setSelectedKey(null);
        oCuit.setValue(null);
        oFecha.setValue(null);
        let oFilter = [];
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
          var orFilterL = [];
          for (var l = 0; l < oRazonsocial.getTokens().length; l++) {
            orFilterL.push(
              new sap.ui.model.Filter(
                "RazonSocial",
                sap.ui.model.FilterOperator.Contains,
                oRazonsocial.getTokens()[l].getKey()
              )
            );
          }
          oFilter.push(new sap.ui.model.Filter(orFilterL, true));
        }

        if (oCuit.getTokens().length !== 0) {
          var orFilterL = [];
          for (var l = 0; l < oCuit.getTokens().length; l++) {
            orFilterL.push(
              new sap.ui.model.Filter(
                "Cuit",
                sap.ui.model.FilterOperator.EQ,
                oCuit.getTokens()[l].getKey()
              )
            );
          }
          oFilter.push(new sap.ui.model.Filter(orFilterL, true));
        }

        if (oRangoFecha.getValue().length !== 0) {
          var oFInicio = oDateFormat.format(oRangoFecha.getFrom());
          var oFFin = oDateFormat.format(oRangoFecha.getTo());

          oFilter.push(
            new Filter("Fecha", sap.ui.model.FilterOperator.BT, oFInicio, oFFin)
          );
        }

        if (oProcesado) {
          if (oProcesado === "X") {
            oFilter.push(
              new sap.ui.model.Filter(
                "Procesado",
                sap.ui.model.FilterOperator.EQ,
                oProcesado
              )
            );
          } else {
            oFilter.push(
              new sap.ui.model.Filter(
                "Procesado",
                sap.ui.model.FilterOperator.NE,
                "X"
              )
            );
          }
        }

        let AllFilter = new sap.ui.model.Filter(oFilter, true);

        this._onRefreshTable(AllFilter);
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

      _onEditMode: function () {
        let oLayoutModel = this.getView().getModel("layout"),
          oEntidad = "/EdicionRecibo",
          oValue = oLayoutModel.getProperty(oEntidad);
        oValue = !oValue;

        oLayoutModel.setProperty(oEntidad, oValue);
      },

      // *** Nuevo Recibo
      onPostPress: async function (oEvent) {
        let oModel = this.getOwnerComponent().getModel(),
          oPath = oEvent.getSource().getBindingContext().getPath(),
          oEntidad = "/RECIBOSSet",
          oView = this.getView(),
          oItem = oEvent.getSource().getBindingContext().getObject();

        let oPayload = {
          Numero: oItem.Numero,
        };

        let rta = await this._oncreateModel(oModel, oView, oEntidad, oPayload);

        if (rta.Respuesta !== "OK") {
          this._onErrorHandle(rta.Datos);
        } else {
          console.log(rta);
        }
      },

      onDetailPress: function (oEvent) {
        let Model = this.getOwnerComponent().getModel(),
          oMockModel = this.getOwnerComponent().getModel("mockdata"),
          oPath = oEvent.getSource().getBindingContext().getPath(),
          oItem = oEvent.getSource().getBindingContext().getObject();
        oMockModel.setProperty("/ReciboActivo", oItem);
        this.getOwnerComponent().getTargets().display("TargetDetalle");
      },
    });
  }
);
