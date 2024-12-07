import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import axios from 'axios';

@Injectable()
export class PaymentService {
  async createPaymentOrder(paypalClientId: CreatePaymentDto) {

    const username = process.env.PAYPAL_CLIENT_ID || paypalClientId;
    const password = process.env.PAYPAL_SECRET_KEY;
    const token = btoa(`${username}:${password}`);

    // try {
    //   // generate access token
    //   const accessToken = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token',
    //     { grant_type: 'client_credentials' },
    //     {
    //       headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         'Authorization': `Basic ${token}`
    //       }
    //     }
    //   );

    //   return accessToken.data;

    // } catch (error) {
    //   console.log(error);
    //   return 'error :(';
    // }

    const { data } = await axios.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      intent: 'CAPTURE',
      purchase_units: [
        {
          'amount': {
            'currency_code': 'USD',
            'value': '1.00'
          }
        }
      ]
    }, {
      headers: {
        'Authorization': 'Basic ' + token,
        'Content-Type': 'application/json'
      }
    });
    return data;

    // fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // 'PayPal-Request-Id': '7b92603e-77ed-4896-8e78-5dea2050476a',
    //     'Authorization': 'Bearer AZiYWsllYqRZqyH5lP5Fq4-NOeSCLclD7Ou2TFtV4il8Il2HUcyzc06FMU5l_jrTOviZA68wyynlY7J7'
    //   },

    // });

    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
