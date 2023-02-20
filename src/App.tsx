import { PlusOutlined } from "@ant-design/icons";
import type {
  ProColumns,
  ProDescriptionsItemProps
} from "@ant-design/pro-components";
import {
  ProCard,
  ProDescriptions,
  ProTable,
  TableDropdown
} from "@ant-design/pro-components";
import { Button, message, Space, Tabs, Tag } from "antd";
import { useState } from "react";
import request from "umi-request";

type StatusItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

const columns: ProColumns<GithubIssueItem>[] = [
  {
    title: "index",
    dataIndex: "index",
    width: 64,
    valueType: "indexBorder"
  },
  {
    title: "title",
    dataIndex: "title",
    copyable: true,
    ellipsis: true,
    search: false
  },
  {
    title: (_, type) => (type === "table" ? "状态" : "列表状态"),
    dataIndex: "state",
    initialValue: "all",
    filters: true,
    onFilter: true,
    valueType: "select",
    valueEnum: {
      all: { text: "Default", status: "Default" },
      open: {
        text: "Error",
        status: "Error"
      },
      closed: {
        text: "Success",
        status: "Success"
      }
    }
  },
  {
    title: "direction",
    key: "direction",
    hideInTable: true,
    hideInDescriptions: true,
    dataIndex: "direction",
    filters: true,
    onFilter: true,
    valueType: "select",
    valueEnum: {
      online: "online",
      offline: "offline"
    }
  },
  {
    title: "labels",
    dataIndex: "labels",
    width: 120,
    render: (_, row) => (
      <Space>
        {row.labels.map(({ name, color }) => (
          <Tag color={color} key={name}>
            {name}
          </Tag>
        ))}
      </Space>
    )
  },
  {
    title: "option",
    valueType: "option",
    dataIndex: "id",
    render: (text, row) => [
      <a href={row.url} key="show" target="_blank" rel="noopener noreferrer">
        show
      </a>,
      <TableDropdown
        key="more"
        onSelect={(key) => message.info(key)}
        menus={[
          { key: "copy", name: "copy" },
          { key: "delete", name: "delete" }
        ]}
      />
    ]
  }
];

let tableDataRequest = async (params = {}) =>
  request<{
    data: GithubIssueItem[];
  }>("https://proapi.azurewebsites.net/github/issues", {
    params
  });

let dataRequest = async (params) => {
  const msg = await request<{
    data: GithubIssueItem[];
  }>("https://proapi.azurewebsites.net/github/issues", {
    params
  });
  return {
    ...msg,
    data: msg?.data[0]
  };
};

export default () => {
  const [type, setType] = useState("table");
  return (
    <ProCard>
      <Tabs activeKey={type} onChange={(e) => setType(e)}>
        <Tabs.TabPane tab="table" key="table" />
        <Tabs.TabPane tab="form" key="form" />
        <Tabs.TabPane tab="descriptions" key="descriptions" />
      </Tabs>
      {["table", "form"].includes(type) && (
        <ProTable<GithubIssueItem>
          columns={columns}
          type={type as "table"}
          request={tableDataRequest}
          pagination={{
            pageSize: 5
          }}
          rowKey="id"
          dateFormatter="string"
          headerTitle="Table"
          toolBarRender={() => [
            <Button key="3" type="primary">
              <PlusOutlined />
              Add
            </Button>
          ]}
        />
      )}
      {type === "descriptions" && (
        <ProDescriptions
          style={{
            background: "#fff"
          }}
          columns={columns as ProDescriptionsItemProps<GithubIssueItem>[]}
          request={dataRequest}
        />
      )}
    </ProCard>
  );
};
