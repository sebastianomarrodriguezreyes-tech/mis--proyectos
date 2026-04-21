using System;

class Program
{
    static void Main()
    {
        double num1, num2, resultado = 0;
        string operacion;

        Console.WriteLine("=== CALCULADORA ===");

        Console.Write("Digite el primer número: ");
        num1 = Convert.ToDouble(Console.ReadLine());

        Console.Write("Digite el segundo número: ");
        num2 = Convert.ToDouble(Console.ReadLine());

        Console.Write("Digite la operación (+, -, *, /): ");
        operacion = Console.ReadLine();

        if (operacion == "+")
        {
            resultado = num1 + num2;
            Console.WriteLine("Resultado: " + resultado);
        }
        else if (operacion == "-")
        {
            resultado = num1 - num2;
            Console.WriteLine("Resultado: " + resultado);
        }
        else if (operacion == "*")
        {
            resultado = num1 * num2;
            Console.WriteLine("Resultado: " + resultado);
        }
        else if (operacion == "/")
        {
            if (num2 != 0)
            {
                resultado = num1 / num2;
                Console.WriteLine("Resultado: " + resultado);
            }
            else
            {
                Console.WriteLine("Error: no se puede dividir entre cero.");
            }
        }
        else
        {
            Console.WriteLine("Operación no válida.");
        }

        Console.WriteLine("Presione una tecla para salir...");
        Console.ReadKey();
    }
}