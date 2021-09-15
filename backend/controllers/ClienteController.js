'use strict';

var Cliente = require('../models/cliente');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

const registro_cliente = async function (req, res) {
  var data = req.body;
  var clientes_arr = [];

  clientes_arr = await Cliente.find({ email: data.email });
  if (clientes_arr.length == 0) {
    //encriptación contraseña
    if (data.password) {
      bcrypt.hash(data.password, null, null, async function (err, hash) {
        if (hash) {
          data.password = hash;
          var reg = await Cliente.create(data);
          res.status(200).send({ data: reg });
        } else {
          res.status(200).send({ message: 'ErrorServer', data: undefined });
        }
      });
    } else {
      res
        .status(200)
        .send({ message: 'No hay una contraseña', data: undefined });
    }
  } else {
    res
      .status(200)
      .send({ message: 'El correo ya está registrado', data: undefined });
  }
};

const login_cliente = async function (req, res) {
  var data = req.body;
  var cliente_arr = [];

  cliente_arr = await Cliente.find({ email: data.email });

  if (cliente_arr.length == 0) {
    res
      .status(200)
      .send({ message: 'no se encontró el correo', data: undefined });
  } else {
    //login
    let user = cliente_arr[0];
    //comparamos la contraseña del login con la encriptada en la BD
    bcrypt.compare(data.password, user.password, async function (error, check) {
      if (check) {
        res.status(200).send({ data: user, token: jwt.createToken(user) });
      } else {
        res
          .status(200)
          .send({ message: 'La contraseña es incorrecta', data: undefined });
      }
    });
  }
};

const listar_clientes_filtro_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == 'admin') {
      let tipo = req.params['tipo'];
      let filtro = req.params['filtro'];
      console.log(tipo);
      if (tipo == null || tipo == 'null') {
        let reg = await Cliente.find();
        res.status(200).send({ data: reg });
      } else {
        if (tipo == 'apellidos') {
          let reg = await Cliente.find({ apellidos: new RegExp(filtro, 'i') });
          res.status(200).send({ data: reg });
        } else if (tipo == 'correo') {
          let reg = await Cliente.find({ email: new RegExp(filtro, 'i') });
          res.status(200).send({ data: reg });
        }
      }
      let reg = await Cliente.find();
      res.status(200).send({ data: reg });
    } else {
      res.status(500).send({ message: 'No access' });
    }
  } else {
    res.status(500).send({ message: 'No access' });
  }
};

const registro_cliente_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == 'admin') {
      var data = req.body;

      bcrypt.hash('password', null, null, async function (error, hash) {
        if (hash) {
          data.password = hash;
          let reg = await Cliente.create(data);
          res.status(200).send({ data: data });
        } else {
          res
            .status(200)
            .send({ message: 'Error en el servidor', data: undefined });
        }
      });
    } else {
      res.status(500).send({ message: 'No access' });
    }
  } else {
    res.status(500).send({ message: 'No access' });
  }
};

const obtener_cliente_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == 'admin') {
      var id = req.params['id'];
      try {
        var reg = await Cliente.findById({ _id: id });
        res.status(200).send({ data: reg });
      } catch (error) {
        res.status(200).send({ data: undefined });
      }
    } else {
      res.status(500).send({ message: 'No access' });
    }
  } else {
    res.status(500).send({ message: 'No access' });
  }
};

const actualizar_cliente_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == 'admin') {
      var id = req.params['id'];
      var data = req.body;
      var reg = await Cliente.findByIdAndUpdate(
        { _id: id },
        {
          nombres: data.nombres,
          apellidos: data.apellidos,
          email: data.email,
          telefono: data.telefono,
          f_nac: data.f_nac,
          cedula: data.cedula,
          genre: data.genre,
        }
      );
      res.status(200).send({ data: reg });
    } else {
      res.status(500).send({ message: 'No access' });
    }
  } else {
    res.status(500).send({ message: 'No access' });
  }
};

const eliminar_cliente_admin = async function (req, res) {
  if (req.user) {
    if (req.user.rol == 'admin') {
      var id = req.params['id'];

      let reg = await Cliente.findByIdAndRemove({ _id: id });
      res.status(200).send({ data: reg });
    } else {
      res.status(500).send({ message: 'No access' });
    }
  } else {
    res.status(500).send({ message: 'No access' });
  }
};
const obtener_cliente_guest = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];

    try {
      var reg = await Cliente.findById({ _id: id });

      res.status(200).send({ data: reg });
    } catch (error) {
      res.status(200).send({ data: undefined });
    }
  } else {
    res.status(500).send({ message: 'NOACCESS' });
  }
};

const actualizar_perfil_cliente_guest = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];

    var data = req.body;

    var reg = await Cliente.findByIdAndUpdate(
      { _id: id },
      {
        nombres: data.nombres,
        apellidos: data.apellidos,
        telefono: data.telefono,
        f_nacimiento: data.f_nacimiento,
        dni: data.dni,
        genero: data.genero,
        pais: data.pais,
      }
    );
    res.status(200).send({ data: reg });
  } else {
    res.status(500).send({ message: 'NOACCESS' });
  }
};

// ORDENES

const obtener_ordenes_cliente = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];

    let reg = await Venta.find({ cliente: id }).sort({ createdAt: -1 });

    if (reg.length >= 1) {
      res.status(200).send({ data: reg });
    } else if (reg.length == 0) {
      res.status(200).send({ data: undefined });
    }
  } else {
    res.status(500).send({ message: 'No access' });
  }
};

const obtener_detalles_ordenes_cliente = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];

    try {
      let venta = await Venta.findById({ _id: id })
        .populate('direccion')
        .populate('cliente');
      let detalles = await Dventa.find({ venta: id }).populate('producto');

      res.status(200).send({ data: venta, detalles: detalles });
    } catch (error) {
      res.status(200).send({ data: undefined });
    }
  } else {
    res.status(500).send({ message: 'No access' });
  }
};

// DIRECCIONES

const registro_direccion_cliente = async function (req, res) {
  if (req.user) {
    var data = req.body;

    if (data.principal) {
      let direcciones = await Direccion.find({ cliente: data.cliente });

      direcciones.forEach(async (element) => {
        await Direccion.findByIdAndUpdate(
          { _id: element._id },
          { principal: false }
        );
      });
    }

    let reg = await Direccion.create(data);

    res.status(200).send({ data: reg });
  } else {
    res.status(500).send({ message: 'No access' });
  }
};

const obtener_direccion_cliente = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];

    let direcciones = await Direccion.find({ cliente: id })
      .populate('cliente')
      .sort({ createdAt: -1 });

    res.status(200).send({ data: direcciones });
  } else {
    res.status(500).send({ message: 'No access' });
  }
};

const cambiar_direccion_principal = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];
    var cliente = req.params['cliente'];

    let direcciones = await Direccion.find({ cliente: cliente });

    direcciones.forEach(async (element) => {
      await Direccion.findByIdAndUpdate(
        { _id: element._id },
        { principal: false }
      );
    });

    await Direccion.findByIdAndUpdate({ _id: id }, { principal: true });

    res.status(200).send({ data: true });
  } else {
    res.status(500).send({ message: 'No access' });
  }
};

const obtener_direccion_principal_cliente = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];

    var direccion = undefined;

    direccion = await Direccion.findOne({ cliente: id, principal: true });

    if (direccion == undefined) {
      res.status(200).send({ data: undefined });
    } else {
      res.status(200).send({ data: direccion });
    }
  } else {
    res.status(500).send({ message: 'No access' });
  }
};

// ************************************ CONTACTO ********************************//

const enviar_mensaje_contacto = async function (req, res) {
  let data = req.body;

  data.estado = 'Abierto';

  let reg = await Contacto.create(data);

  res.status(200).send({ data: reg });
};

module.exports = {
  registro_cliente,
  login_cliente,
  listar_clientes_filtro_admin,
  registro_cliente_admin,
  obtener_cliente_admin,
  actualizar_cliente_admin,
  eliminar_cliente_admin,
  obtener_cliente_guest,
  actualizar_perfil_cliente_guest,
  registro_direccion_cliente,
  obtener_direccion_cliente,
  cambiar_direccion_principal,
  obtener_direccion_principal_cliente,
  enviar_mensaje_contacto,
  obtener_ordenes_cliente,
  obtener_detalles_ordenes_cliente,
};
