import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseUpperCasePipe implements PipeTransform {
  transform(value: any, _: ArgumentMetadata): string {
    // Verificar si el valor no es null, undefined o vacío
    if (typeof value !== 'string') {
      throw new BadRequestException('El valor proporcionado no es una cadena de texto');
    }

    // Convertir el valor a mayúsculas
    const upperCaseValue = value.toUpperCase();

    return upperCaseValue;
  }
}
