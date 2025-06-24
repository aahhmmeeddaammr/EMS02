import { DataTypes } from "sequelize";
import { sequelize } from "../connection.db.js";
export const UserModel = sequelize.define(
  "user",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Enter valid email format" },
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 18,
        max: 65,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue("image");
        const rgex = /^http:\/\/localhost:3000/;
        if (!rawValue) return null;
        if (rgex.test(rawValue)) return rawValue;
        return `http://localhost:3000/${rawValue.replace(/\\/g, "/")}`;
      },
    },
  },
  {}
);
