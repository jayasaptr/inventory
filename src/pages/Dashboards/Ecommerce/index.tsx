import React, { useEffect } from "react";
import BreadCrumb from "Common/BreadCrumb";
import WelcomeWidget from "./WelcomeWidget";
import OrderStatistics from "./OrderStatistics";
import Widgets from "./Widgets";
import SalesRevenue from "./SalesRevenue";
import TrafficResources from "./TrafficResources";
import ProductsOrders from "./ProductsOrders";
import CustomerService from "./CustomerService";
import SalesMonth from "./SalesMonth";
import TopSellingProducts from "./TopSellingProducts";
import Audience from "./Audience";
import Layout from "Layout";

const Ecommerce = () => {
  return (
    <Layout>
      <BreadCrumb title="Summary" pageTitle="Dashboards" />
      <div className="grid grid-cols-12 gap-x-5">
        <Widgets />
        <div style={{ display: "none" }}>
          <SalesRevenue />
        </div>
      </div>
    </Layout>
  );
};

export default Ecommerce;
